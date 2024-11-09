export class GeneralMessages {
  constructor() {}
  public sendStartMessage(username: string): string {
    const messageText = `<b>ScAlp Wallet Tracker</b>

<b>Merhaba, ${username}.</b>

🍪 Eklediğiniz tüm cüzdanlar için gerçek zamanlı etkinlik bildirimleri alın!
`;
    return messageText;
  }
  public sendGeneralMessageError(): string {
    const messageText = `<b>ScAlp Wallet Tracker</b>
    
Ups! Bir takım hatalar oluştu.
`;
    return messageText;
  }
}
