import TelegramBot from "node-telegram-bot-api";
import { AddCommand } from "../commands/add-command";
import { START_MENU } from "../../config/bot-menus";
import { ManageCommand } from "../commands/manage-command";
import { DeleteCommand } from "../commands/delete-command";
import {
  userExpectingDonation,
  userExpectingWalletAddress,
} from "../../constants/flags";
import { GeneralMessages } from "../messages/general-messages";
import { SettingsCommand } from "../commands/settings-command";
import { UpdateBotStatusHandler } from "./update-bot-status-handler";

export class CallbackQueryHandler {
  private addCommand: AddCommand;
  private manageCommand: ManageCommand;
  private deleteCommand: DeleteCommand;
  private settingsCommand: SettingsCommand;
  private updateBotStatusHandler: UpdateBotStatusHandler;
  private generalMessages: GeneralMessages;
  constructor(private bot: TelegramBot) {
    this.bot = bot;
    this.addCommand = new AddCommand(this.bot);
    this.manageCommand = new ManageCommand(this.bot);
    this.deleteCommand = new DeleteCommand(this.bot);
    this.settingsCommand = new SettingsCommand(this.bot);
    this.updateBotStatusHandler = new UpdateBotStatusHandler(this.bot);
    this.generalMessages = new GeneralMessages();
  }
  public call() {
    this.bot.on("callback_query", async (callbackQuery) => {
      const message = callbackQuery.message;
      const chatId = message?.chat.id;
      const data = callbackQuery.data;
      const userId = message?.chat.id.toString();
      if (!chatId || !userId) {
        return;
      }
      switch (data) {
        case "add":
          this.addCommand.addButtonHandler(message);
          break;
        case "manage":
          await this.manageCommand.manageButtonHandler(message);
          break;
        case "delete":
          this.deleteCommand.deleteButtonHandler(message);
          break;
        case "settings":
          this.settingsCommand.settingsCommandHandler(message);
          break;
        case "pause-resume-bot":
          await this.updateBotStatusHandler.pauseResumeBot(message);
          break;
        case "back_to_main_menu":
          const messageText = this.generalMessages.sendStartMessage();
          userExpectingWalletAddress[Number(chatId)] = false;
          userExpectingDonation[Number(chatId)] = false;
          this.bot.editMessageText(messageText, {
            chat_id: chatId,
            message_id: message.message_id,
            reply_markup: START_MENU,
            parse_mode: "HTML",
          });
          break;
      }
    });
  }
}
