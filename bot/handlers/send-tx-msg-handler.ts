import TelegramBot from "node-telegram-bot-api";
import { TokenPrices } from "../../lib/token-prices-api";
import { FormatNumbers } from "../../lib/format-numbers";
import { createTxSubMenu } from "../../config/bot-menus";
import { TxMessages } from "../messages/tx-message";
import { NativeParserInterface } from "../../types/general-interfaces";
import { JsonDatabase } from "../../db/db";

export class SendTransactionMsgHandler {
  private txMessages: TxMessages;
  private tokenPrices: TokenPrices;
  private formatNumbers: FormatNumbers;
  private db: JsonDatabase;
  constructor(private bot: TelegramBot) {
    this.bot = bot;
    this.txMessages = new TxMessages();
    this.tokenPrices = new TokenPrices();
    this.formatNumbers = new FormatNumbers();
    this.db = new JsonDatabase();
  }
  public async send(message: NativeParserInterface, chatId: string) {
    const tokenToMc =
      message.type === "buy"
        ? message.tokenTransfers.tokenInMint
        : message.tokenTransfers.tokenOutMint;
    const tokenToMcSymbol =
      message.type === "buy"
        ? message.tokenTransfers.tokenInSymbol
        : message.tokenTransfers.tokenOutSymbol;
    const TX_SUB_MENU = createTxSubMenu(tokenToMcSymbol, tokenToMc);
    const walletName = "any";
    if (!walletName || !message.owner) {
      console.log("Address not found in user wallets");
      return;
    }
    try {
      if (message.platform === "raydium" || message.platform === "jupiter") {
        let tokenMarketCap = message.swappedTokenMc;
        if (tokenMarketCap && tokenMarketCap < 1000) {
          console.log("MC ADJUSTED");
          tokenMarketCap *= 1000;
        }
        const formattedMarketCap = tokenMarketCap
          ? this.formatNumbers.formatMarketCap(tokenMarketCap)
          : undefined;
        const messageText = this.txMessages.sendTxMessage(
          message,
          formattedMarketCap,
          walletName
        );
        return this.bot.sendMessage(chatId, messageText, {
          parse_mode: "HTML",
          disable_web_page_preview: true,
          reply_markup: TX_SUB_MENU,
        });
      } else if (message.platform === "pumpfun") {
        const tokenInfo = await this.tokenPrices.pumpFunTokenInfo(tokenToMc);
        let tokenMarketCap = tokenInfo?.usd_market_cap;
        const formattedMarketCap = tokenMarketCap
          ? this.formatNumbers.formatMarketCap(tokenMarketCap)
          : undefined;
        const messageText = this.txMessages.sendTxMessage(
          message,
          formattedMarketCap,
          walletName
        );
        return this.bot.sendMessage(chatId, messageText, {
          parse_mode: "HTML",
          disable_web_page_preview: true,
          reply_markup: TX_SUB_MENU,
        });
      }
    } catch (error: any) {
      if (error.response && error.response.statusCode === 403) {
        console.log(
          `User ${chatId} has blocked the bot or chat no longer exists`
        );
      } else {
        console.log(`Failed to send message to ${chatId}:`, error);
      }
    }
    return;
  }
}
