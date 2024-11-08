import { PublicKey } from "@solana/web3.js";
import { connection } from "../providers/solana";
import { formatDistanceToNow } from "date-fns";

export class WalletDetails {
  constructor() {}
  public async getLastWalletTx(walletAddress: string) {
    const signatures = await connection.getSignaturesForAddress(
      new PublicKey(walletAddress),
      {
        limit: 1,
      }
    );
    if (signatures.length === 0) {
      console.log("No transactions found for this wallet.");
      return null;
    }
    const latestSignature = signatures[0].signature;
    const transaction = await connection.getTransaction(latestSignature, {
      maxSupportedTransactionVersion: 0,
    });
    if (transaction?.blockTime === null) {
      console.log("Block time not available for this transaction.");
      return null;
    }
    const date = new Date(transaction!.blockTime! * 1000);
    const timeAgo = formatDistanceToNow(date, { addSuffix: true });
    console.log("LAST TX DATE:", timeAgo);
    return timeAgo;
  }
}
