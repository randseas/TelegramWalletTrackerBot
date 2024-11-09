import { JsonDatabase } from "../db/db";
import { connection } from "../providers/solana";
import { Wallet } from "../types/general-interfaces";
import { WatchTransaction } from "./watch-transactions";

export const walletsToTrack: Wallet[] = [];

export class TrackWallets {
  private db: JsonDatabase;
  private walletWatcher: WatchTransaction;
  public walletsState: [];
  constructor() {
    this.db = new JsonDatabase();
    this.walletWatcher = new WatchTransaction(connection);
    this.walletsState = [];
  }
  public async setupWalletWatcher(): Promise<void> {
    const allWallets: Wallet[] = await this.db.getAllWallets();
    walletsToTrack?.push(...allWallets);
    return await this.walletWatcher.watchSocket(walletsToTrack);
  }
}
