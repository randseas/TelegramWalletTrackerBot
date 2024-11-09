import TelegramBot from "node-telegram-bot-api";
import { SUB_MENU } from "../../config/bot-menus";
import { JsonDatabase } from "../../db/db";

export class UpdateBotStatusHandler {
  private db: JsonDatabase;
  constructor(private bot: TelegramBot) {
    this.db = new JsonDatabase();
    this.bot = bot;
  }
  public async pauseResumeBot(msg: TelegramBot.Message) {
    const chatId = msg.chat.id;
    const changedStatus = "paused";
    const messageText = `
${
  changedStatus === "paused"
    ? `
Bot has been paused and you will no longer receive notifications until you resume it!
    
You can still resume the bot anytime in the settings menu
`
    : changedStatus === "active"
      ? `
Bot has been resumed and you will start receiving notifications again!
    
Feel free to adjust your preferences anytime in the settings menu
`
      : ""
}
`;
    this.bot.editMessageText(messageText, {
      chat_id: chatId,
      message_id: msg.message_id,
      reply_markup: SUB_MENU,
      parse_mode: "HTML",
    });
  }
}
