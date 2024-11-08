import { Connection, PublicKey, Logs } from "@solana/web3.js";
import EventEmitter from "events";
import { TransactionParser } from "../parsers/transaction-parser";
import { SendTransactionMsgHandler } from "../bot/handlers/send-tx-msg-handler";
import { bot } from "../providers/telegram";
import { SwapType, WalletWithUsers } from "../types/swap-types";
import {
  JUPITER_PROGRAM_ID,
  PUMP_FUN_PROGRAM_ID,
  RAYDIUM_PROGRAM_ID,
} from "../config/program-ids";

export const trackedWallets: Set<string> = new Set();

export class WatchTransaction extends EventEmitter {
  public subscriptions: Map<string, number>;
  private walletTransactions: Map<string, { count: number; startTime: number }>;
  private excludedWallets: Map<string, boolean>;
  constructor(private connection: Connection) {
    super();
    this.subscriptions = new Map();
    this.walletTransactions = new Map();
    this.excludedWallets = new Map();
    this.connection = connection;
  }
  public async watchSocket(wallets: WalletWithUsers[]): Promise<void> {
    try {
      for (const wallet of wallets) {
        const publicKey = new PublicKey(wallet.address);
        const walletAddress = publicKey.toBase58();
        if (this.subscriptions.has(walletAddress)) {
          continue;
        }
        console.log(
          `[tx]=> Watching transactions for wallet: ${walletAddress}`
        );
        this.walletTransactions.set(walletAddress, {
          count: 0,
          startTime: Date.now(),
        });
        const subscriptionId = this.connection.onLogs(
          publicKey,
          async (logs, ctx) => {
            if (this.excludedWallets.has(walletAddress)) {
              console.log(`Wallet ${walletAddress} is excluded from logging.`);
              return;
            }
            const { isRelevant, swap } = this.isRelevantTransaction(logs);
            if (!isRelevant) {
              console.log("TRANSACTION IS NOT DEFI");
              return;
            }
            const walletData = this.walletTransactions.get(walletAddress);
            if (!walletData) {
              return;
            }
            const transactionSignature = logs.signature;
            const transactionDetails =
              await this.getParsedTransaction(transactionSignature);
            if (!transactionDetails) {
              return;
            }
            const transactionParser = new TransactionParser(
              transactionSignature,
              this.connection
            );
            const parsed = await transactionParser.parseRpc(
              transactionDetails,
              swap
            );
            if (!parsed) {
              return;
            }
            const sendMessageHandler = new SendTransactionMsgHandler(bot);
            const activeUsers = wallet.userWallets.filter(
              (w: any) => w.status === "active"
            );
            const uniqueActiveUsers = Array.from(
              new Set(activeUsers.map((user: any) => user.userId))
            ).map((userId) =>
              activeUsers.find((user: any) => user.userId === userId)
            );
            for (const user of uniqueActiveUsers) {
              if (user) {
                try {
                  await sendMessageHandler.send(parsed, user.userId);
                } catch (error) {
                  console.log(`Error sending message to user ${user.userId}`);
                }
              }
            }
          },
          "confirmed"
        );
        this.subscriptions.set(wallet.address, subscriptionId);
        console.log(
          `Subscribed to logs with subscription ID: ${subscriptionId}`
        );
      }
    } catch (error) {
      console.error("Error in watchSocket:", error);
    }
  }
  private async getParsedTransaction(transactionSignature: string) {
    try {
      const transactionDetails = await this.connection.getParsedTransactions(
        [transactionSignature],
        {
          maxSupportedTransactionVersion: 0,
        }
      );
      return transactionDetails;
    } catch (error) {
      console.log("GET_PARSED_TRANSACTIONS_ERROR", error);
      return;
    }
  }
  private isRelevantTransaction(logs: Logs): {
    isRelevant: boolean;
    swap: SwapType;
  } {
    if (!logs.logs || logs.logs.length === 0) {
      return { isRelevant: false, swap: null };
    }
    const logString = logs.logs.join(" ");
    if (logString.includes(PUMP_FUN_PROGRAM_ID)) {
      return { isRelevant: true, swap: "pumpfun" };
    }
    if (logString.includes(RAYDIUM_PROGRAM_ID)) {
      return { isRelevant: true, swap: "raydium" };
    }
    if (logString.includes(JUPITER_PROGRAM_ID)) {
      return { isRelevant: true, swap: "jupiter" };
    }
    return { isRelevant: false, swap: null };
  }
}
