interface CreateIdempotentInfo {
  owner: string;
  token: string;
}
interface TransferInfo {
  source: string;
  destination: string;
  lamports: number;
}
interface SyncNativeInfo {}
interface TransferCheckedInfo {
  source: string;
  destination: string;
  amount: number;
}
interface CloseAccountInfo {
  source: string;
  account: string;
}
interface SwapInfo {
  source: string;
  amountIn: number;
  tokenIn: string;
  amountOut: number;
  tokenOut: string;
}
interface UnknownInfo {}
export type ParsedInfo =
  | CreateIdempotentInfo
  | TransferInfo
  | SyncNativeInfo
  | TransferCheckedInfo
  | CloseAccountInfo
  | SwapInfo
  | UnknownInfo;