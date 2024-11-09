export class DeleteWalletMessage {
  constructor() {}
  public sendDeleteWalletMessage() {
    const messageText = `<b>ScAlp Wallet Tracker</b>

<b>🗑️ Cüzdan silme</b>

Cüzdan adreslerini aşağıdaki formatta gönderin, aynı anda birden fazla cüzdan adresi silebilirsiniz.

cüzdanAdresi1
cüzdanAdresi2
`;
    return messageText;
  }
}
