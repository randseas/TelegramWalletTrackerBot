import { PublicKey } from "@solana/web3.js";
import { SwapType } from "../types/swap-types";
import {
  JUPITER_PROGRAM_ID,
  PUMP_FUN_PROGRAM_ID,
  RAYDIUM_PROGRAM_ID,
} from "../config/program-ids";

export class ValidTransactions {
  constructor(private programIds: any) {
    this.programIds = programIds;
  }
  public getDefiTransaction(): { valid: boolean; swap: SwapType } {
    const pumpFunProgramId = new PublicKey(PUMP_FUN_PROGRAM_ID);
    const raydiumProgramId = new PublicKey(RAYDIUM_PROGRAM_ID);
    const jupiterProgramId = new PublicKey(JUPITER_PROGRAM_ID);
    const pumpFunTransaction =
      this.programIds &&
      this.programIds.some((id: any) => id.equals(pumpFunProgramId));
    const raydiumTransaction =
      this.programIds &&
      this.programIds.some((id: any) => id.equals(raydiumProgramId));
    const jupiterTransaction =
      this.programIds &&
      this.programIds.some((id: any) => id.equals(jupiterProgramId));
    if (pumpFunTransaction) {
      console.log("[tx]=> Detected Pump.fun transaction");
      return { valid: true, swap: "pumpfun" };
    } else if (jupiterTransaction) {
      console.log("[tx]=> Detected Jupiter transaction");
      return { valid: true, swap: "jupiter" };
    } else if (raydiumTransaction) {
      console.log("[tx]=> Detected Raydium transaction");
      return { valid: true, swap: "raydium" };
    } else {
      return { valid: false, swap: null };
    }
  }
}
