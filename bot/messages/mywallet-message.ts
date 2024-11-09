import { UserBalances } from "../../lib/user-balances";
import { SelfWallet } from "../../types/general-interfaces";

export class MyWalletMessages {
  private userBalances: UserBalances;
  constructor() {
    this.userBalances = new UserBalances();
  }
  public async sendMyWalletMessage(
    wallet: SelfWallet
  ): Promise<string> {
    const solBalance = await this.userBalances.userPersonalSolBalance(
      wallet.publicKey
    );
    const responseText = `
<b>Your wallet address:</b> 
<code>${wallet && wallet.publicKey}</code>

<b>SOL:</b> ${solBalance ? solBalance / 1e9 : 0}

`;
    return responseText;
  }
}
