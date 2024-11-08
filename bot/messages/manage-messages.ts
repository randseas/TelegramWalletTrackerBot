import { WalletDetails } from "../../lib/wallet-details";

export class ManageMessages {
  private walletDetails: WalletDetails;
  constructor() {
    this.walletDetails = new WalletDetails();
  }
  public async sendManageMessage(
    userWallets: UserWallet[],
    walletsAmt: number
  ) {
    const messageText = `<b>ScAlp Wallet Tracker</b>

<b>📰 Cüzdanlar: ${userWallets.length} / ${walletsAmt}</b>

${userWallets
  .map((wallet, i) => {
    const icon =
      wallet.status === "ACTIVE"
        ? ""
        : wallet.status === "USER_PAUSED"
          ? "⏸️ "
          : wallet.status === "BANNED"
            ? "🛑 "
            : "";
    return `${icon}${i + 1} - <code>${wallet.wallet.address}</code> ${wallet.name ? `(${wallet.name})` : ""}`;
  })
  .join("\n\n")}
`;
    return messageText;
  }
}
