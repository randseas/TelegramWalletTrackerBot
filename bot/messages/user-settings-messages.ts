export class UserSettingsMessages {
  constructor() {}

  public sendSettingsMessage(): string {
    const messageText = `<b>ScAlp Wallet Tracker</b>
    
<b>⚙️ Ayarlar</b>

Aşağıdaki düğmeye tıklayarak botu istediğiniz zaman duraklatabilir veya devam ettirebilirsiniz
Botu duraklatırsanız, botu aynı menüden devam ettirene kadar artık daha fazla mesaj almayacaksınız
`;
    return messageText;
  }
}
