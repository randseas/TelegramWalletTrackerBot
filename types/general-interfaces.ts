import { SwapType } from "./swap-types";

export interface NativeParserInterface {
  platform: SwapType;
  owner: string;
  description: string;
  type: string | undefined;
  balanceChange: string | number | undefined;
  signature: string;
  swappedTokenMc: number | null | undefined;
  solPrice: string;
  tokenTransfers: {
    tokenInSymbol: string;
    tokenOutSymbol: string;
    tokenInMint: string;
    tokenOutMint: string;
    tokenAmountIn: string;
    tokenAmountOut: string;
  };
}
export interface Wallet {
  name: string;
  address: string;
  status: "active" | "paused";
}
export interface CreateUserInterface {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  status: "active" | "paused";
  wallets: Wallet[];
}
export interface ParsedTxInfo {
  info: {
    amount: string;
    authority: string;
    destination: string;
    source: string;
  };
  type: string;
}
export interface SetupWalletWatcherProps {
  userId?: string | null;
  walletId?: string | null;
  event: "create" | "delete" | "initial" | "update";
}
