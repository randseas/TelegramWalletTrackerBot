import TelegramBot from "node-telegram-bot-api";
import { START_MENU } from "../../config/bot-menus";
import { PrismaUserRepository } from "../../repositories/prisma/user";
import { GeneralMessages } from "../messages/general-messages";
import { JsonDatabase } from "../../db/db";

export class StartCommand {
  private db: JsonDatabase;
  private generalMessages: GeneralMessages;
  constructor(private bot: TelegramBot) {
    this.bot = bot;
    this.db = new JsonDatabase();
    this.generalMessages = new GeneralMessages();
  }
  public start() {
    this.bot.onText(/\/start/, async (msg) => {
      const chatId = msg.chat.id;
      const firstName = msg.from?.first_name || "";
      const lastName = msg.from?.last_name || "";
      const username = msg.from?.username || "";
      const userId = msg.chat.id.toString();
      if (!userId) {
        return;
      }
      const messageText = this.generalMessages.sendStartMessage();
      this.bot.sendMessage(chatId, messageText, {
        reply_markup: START_MENU,
        parse_mode: "HTML",
      });
      const user = await this.db.getById(userId);
      if (!user) {
        await this.db.addUser({});
      }
    });
  }
}
