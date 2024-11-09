import { Wallet } from "../../types/general-interfaces";

export class ManageMessages {
  constructor() {}
  public async sendManageMessage(userWallets: Wallet[]) {
    const messageText = `<b>ScAlp Wallet Tracker</b>

<b>🔧 Yönet: ${userWallets.length}</b>

${userWallets
  .map((wallet, i) => {
    const icon =
      wallet.status === "active" ? "" : wallet.status === "paused" ? "⏸️ " : "";
    return `${icon}${i + 1} - <code>${wallet.address}</code> ${wallet.name ? `(${wallet.name})` : ""}`;
  })
  .join("\n\n")}
`;
    return messageText;
  }
}
