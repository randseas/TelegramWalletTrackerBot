export class UserSettingsMessages {
  constructor() {}

  public sendSettingsMessage(): string {
    const messageText = `<b>ScAlp Wallet Tracker</b>
    
<b>⚙️ Settings</b>

You can pause or resume bot at anytime just by clicking the button below ✨

If you pause Bot, you will no longer get more messages until you resume the bot from this same menu
`
    return messageText
  }
}
