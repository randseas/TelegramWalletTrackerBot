import TelegramBot from "node-telegram-bot-api";
import { ManageMessages } from "../messages/manage-messages";
import { MANAGE_SUB_MENU } from "../../config/bot-menus";
import { JsonDatabase } from "../../db/db";

export class ManageCommand {
  private db: JsonDatabase;
  private manageMessages: ManageMessages;
  constructor(private bot: TelegramBot) {
    this.bot = bot;
    this.db = new JsonDatabase();
    this.manageMessages = new ManageMessages();
  }
  public async manageButtonHandler(msg: TelegramBot.Message) {
    const userId = msg.chat.id.toString();
    const user = await this.db.findOne(userId);
    const userWallets = user?.trackWallets;
    const messageText = await this.manageMessages.sendManageMessage(
      userWallets || []
    );
    this.bot.editMessageText(messageText, {
      chat_id: msg.chat.id,
      message_id: msg.message_id,
      reply_markup: MANAGE_SUB_MENU,
      parse_mode: "HTML",
    });
  }
}