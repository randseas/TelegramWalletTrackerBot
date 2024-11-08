import { walletsToTrack } from '../constants/flags'
import { connection } from '../providers/solana'
import { PrismaWalletRepository } from '../repositories/prisma/wallet'
import { SetupWalletWatcherProps } from '../types/general-interfaces'
import { WalletWithUsers } from '../types/swap-types'
import { WatchTransaction } from './watch-transactions'

export const walletsArray: WalletWithUsers[] = []

export class TrackWallets {
  private prismaWalletRepository: PrismaWalletRepository
  private walletWatcher: WatchTransaction

  public walletsState: []

  constructor() {
    this.prismaWalletRepository = new PrismaWalletRepository()
    this.walletWatcher = new WatchTransaction(connection)

    this.walletsState = []
  }

  public async setupWalletWatcher({ event, userId, walletId }: SetupWalletWatcherProps): Promise<void> {
    let walletsToFetch
    if (event === 'delete' && walletId) {
      console.log('EVENT IS DELETE')
      const refetchedWallet = await this.prismaWalletRepository.getWalletByIdForArray(walletId)

      if (refetchedWallet) {
        const existingWalletIndex = walletsArray.findIndex((wallet) => wallet.address === refetchedWallet.address)

        if (existingWalletIndex !== -1) {
          const subscriptionId = this.walletWatcher.subscriptions.get(refetchedWallet.address)
          if (subscriptionId) {
            // Remove the onLogs listener for the current subscription ID
            await connection.removeOnLogsListener(subscriptionId)
            // Delete the subscription from the map after listener removal
            this.walletWatcher.subscriptions.delete(refetchedWallet.address)
          }

          if (refetchedWallet.userWallets.length === 0) {
            // Remove the wallet completely if no userWallets remain
            walletsArray.splice(existingWalletIndex, 1)
          } else {
            // Update the wallet with the new userWallets if users remain
            walletsArray[existingWalletIndex] = refetchedWallet
          }

          return await this.updateWallets(walletsArray!)
        }
      }
    } else if (event === 'create' && walletId) {
      console.log('EVENT IS CREATE')
      const refetchedWallet = await this.prismaWalletRepository.getWalletByIdForArray(walletId)

      if (refetchedWallet) {
        const existingWalletIndex = walletsArray.findIndex((wallet) => wallet.address === refetchedWallet.address)

        // if wallet is already in database
        if (existingWalletIndex !== -1) {
          walletsArray[existingWalletIndex] = refetchedWallet
          const subscriptionId = this.walletWatcher.subscriptions.get(refetchedWallet.address)

          await connection.removeOnLogsListener(subscriptionId as number)
          this.walletWatcher.subscriptions.delete(refetchedWallet.address)
        } else {
          walletsArray.push(refetchedWallet)
        }
      }

      return await this.updateWallets(walletsArray!)
    } else if (event === 'update' && userId) {
      // Fetch all wallets related to the updated user ID
      walletsToFetch = await this.prismaWalletRepository.getUserWalletsWithUserIds(userId)

      walletsToFetch?.forEach(async (fetchedWallet) => {
        const existingWalletIndex = walletsArray.findIndex((wallet) => wallet.address === fetchedWallet.address)

        if (existingWalletIndex !== -1) {
          const subscriptionId = this.walletWatcher.subscriptions.get(fetchedWallet.address)

          if (subscriptionId) {
            // Remove the onLogs listener for the current subscription ID
            await connection.removeOnLogsListener(subscriptionId)
            // Delete the subscription from the map after listener removal
            this.walletWatcher.subscriptions.delete(fetchedWallet.address)
          }

          // Update the wallet in the array with the latest fetched data
          walletsArray[existingWalletIndex] = fetchedWallet
        } else {
          // Add the wallet if it’s not already in the array
          walletsArray.push(fetchedWallet)
        }
      })

      return await this.updateWallets(walletsArray!)
    } else if (event === 'initial') {
      const allWallets = await this.prismaWalletRepository.getAllWalletsWithUserIds()

      // check for paused wallets before initial watcher call
      const pausedWallets = allWallets?.filter((wallet) =>
        wallet.userWallets.some((userWallet) => userWallet.status === 'SPAM_PAUSED'),
      )

      // If there are paused wallets, resume their status
      if (pausedWallets && pausedWallets.length > 0) {
        for (const wallet of pausedWallets) {
          for (const userWallet of wallet.userWallets) {
            if (userWallet.status === 'SPAM_PAUSED') {
              await this.prismaWalletRepository.resumeUserWallet(userWallet.userId, userWallet.walletId)
            }
          }
        }
      }

      walletsArray?.push(...allWallets!)
      // console.log('WALLETS ARRAY:', walletsArray)
      return await this.walletWatcher.watchSocket(walletsArray!)
    }

    return
  }

  public async listenForDatabaseChanges(): Promise<void> {
    while (true) {
      // Infinite loop to keep the process running
      try {
        const stream = await this.prismaWalletRepository.pulseWallet()

        for await (const event of stream!) {
          try {
            console.log('New event:', event)

            if (event.action === 'create') {
              const createdWalletId = event.created.walletId
              await this.setupWalletWatcher({ event: 'create', walletId: createdWalletId })
            } else if (event.action === 'delete') {
              const deletedWalletId = event.deleted.walletId
              // await this.stopWatchingWallet(event.deleted.walletId)
              await this.setupWalletWatcher({ event: 'delete', walletId: deletedWalletId })
            } else if (event.action === 'update') {
              const updatedUserId = event.after.userId
              await this.setupWalletWatcher({ event: 'update', userId: updatedUserId })
            }
          } catch (eventError: any) {
            console.error('Error processing event:', eventError.message)
            throw eventError // This will exit the loop and trigger a reconnect
          }
        }
      } catch (error: any) {
        console.error('Connection lost. Attempting to reconnect...', error.message)
        // Wait before retrying (e.g., 5 seconds)
        await new Promise((resolve) => setTimeout(resolve, 5000))
      }
    }
  }

  public async stopWatching(): Promise<void> {
    for (const [wallet, subscriptionId] of this.walletWatcher.subscriptions) {
      connection.removeOnLogsListener(subscriptionId)
      console.log(`Stopped watching transactions for wallet: ${wallet}`)
    }
    this.walletWatcher.subscriptions.clear()
  }

  public async updateWallets(newWallets: WalletWithUsers[]): Promise<void> {
    // await this.stopWatching();
    console.log('REFETCHING WALLETS')
    await this.walletWatcher.watchSocket(newWallets)
  }

  public async stopWatchingWallet(walletId: string): Promise<void> {
    const walletAddress = await this.prismaWalletRepository.getWalletById(walletId)
    if (!walletAddress) return
    const subscriptionId = this.walletWatcher.subscriptions.get(walletAddress!.address)
    console.log('LENGTH', walletAddress.userWallets.length)
    if (subscriptionId && walletAddress.userWallets.length < 1) {
      connection.removeOnLogsListener(subscriptionId)
      console.log(`Stopped watching transactions for wallet: ${walletAddress!.address}`)
      this.walletWatcher.subscriptions.delete(walletAddress!.address)
    } else {
      console.log(`No active subscription found for wallet: ${walletAddress}`)
    }
  }
}
