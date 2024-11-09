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
export interface SelfWallet {
  publicKey: string;
  privateKey: string;
}
export interface Wallet {
  name: string;
  address: string;
  status: "active" | "paused";
}
export interface User {
  id: string;
  username: string;
  email: string;
  status: "active" | "paused";
  wallet: SelfWallet;
  trackWallets: Wallet[];
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
