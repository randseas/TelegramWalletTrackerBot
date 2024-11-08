import TelegramBot from "node-telegram-bot-api";
import { SUB_MENU } from "../../config/bot-menus";

export class UpdateBotStatusHandler {
  private prismaUserRepository: PrismaUserRepository;
  constructor(private bot: TelegramBot) {
    this.prismaUserRepository = new PrismaUserRepository();
    this.bot = bot;
  }
  public async pauseResumeBot(msg: TelegramBot.Message) {
    const chatId = msg.chat.id;
    const botPaused = await this.prismaUserRepository.updateUserHandiCatStatus(
      String(chatId)
    );
    if (botPaused.status !== "ok") return;
    const changedStatus = botPaused.changedStatus;
    const messageText = `
${
  changedStatus === "PAUSED"
    ? `
Bot has been paused and you will no longer receive notifications until you resume it!
    
You can still resume the bot anytime in the settings menu
`
    : changedStatus === "ACTIVE"
      ? `
Bot has been resumed and you will start receiving notifications again!
    
Feel free to adjust your preferences anytime in the settings menu
`
      : changedStatus === "NONE"
        ? `
Something went wrong while updating the status, please try again later
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
