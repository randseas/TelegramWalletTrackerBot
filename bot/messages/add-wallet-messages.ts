export class AddWalletMessage {
  constructor() {}
  public sendAddWalletMessage() {
    const messageText = `<b>ScAlp Wallet Tracker</b>

<b>➕ Cüzdan ekleme</b>

Cüzdan adreslerini aşağıdaki formatta gönderin, aynı anda birden fazla cüzdan adresi ekleyebilirsiniz.

cüzdanAdresi1 cüzdanAdı1
cüzdanAdresi2 cüzdanAdı2
`;
    return messageText;
  }
}
