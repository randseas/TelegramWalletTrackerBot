import { PublicKey } from "@solana/web3.js";
import { connection } from "../providers/solana";

export class UserBalances {
  constructor() {}
  public async userPersonalSolBalance(
    walletAddress: string
  ): Promise<number | undefined> {
    try {
      const publicKey = new PublicKey(walletAddress);
      const balance = await connection.getBalance(publicKey);
      return balance;
    } catch (error) {
      console.error("USER_FETCH_BALANCE_ERROR", error);
      return;
    }
  }
}
