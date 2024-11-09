import TelegramBot from "node-telegram-bot-api";
import { SUB_MENU } from "../../config/bot-menus";
import { PublicKey } from "@solana/web3.js";
import { userExpectingAddWalletAddress } from "../../constants/flags";
import { DeleteWalletMessage } from "../messages/delete-wallet-message";
import { GeneralMessages } from "../messages/general-messages";
import { JsonDatabase } from "../../db/db";
import { Wallet } from "../../types/general-interfaces";

export class DeleteCommand {
  private db: JsonDatabase;
  private deleteWalletMessage: DeleteWalletMessage;
  constructor(private bot: TelegramBot) {
    this.bot = bot;
    this.db = new JsonDatabase();
    this.deleteWalletMessage = new DeleteWalletMessage()
  }
  public deleteCommandHandler() {
    this.bot.onText(/\/remove/, async (msg) => {
      const userId = msg.from?.id;
      if (!userId) return;
      this.delete({ message: msg, isButton: false });
    });
  }
  public deleteButtonHandler(msg: TelegramBot.Message) {
    this.delete({ message: msg, isButton: true });
  }
  private delete({
    message,
    isButton,
  }: {
    message: TelegramBot.Message;
    isButton: boolean;
  }) {
    const addMessage = this.deleteWalletMessage.sendDeleteWalletMessage();
    if (isButton) {
      this.bot.editMessageText(addMessage, {
        chat_id: message.chat.id,
        message_id: message.message_id,
        reply_markup: SUB_MENU,
        parse_mode: "HTML",
      });
    } else if (!isButton) {
      this.bot.sendMessage(message.chat.id, addMessage, {
        reply_markup: SUB_MENU,
        parse_mode: "HTML",
      });
    }
    const userId = message.chat.id.toString();
    userExpectingAddWalletAddress[String(userId)] = true;
    const listener = async (responseMsg: TelegramBot.Message) => {
      if (!userExpectingAddWalletAddress[String(userId)]) return;
      const text = responseMsg.text;
      const walletEntries = text
        ?.split("\n")
        .map((entry) => entry.trim())
        .filter(Boolean);
      if (!walletEntries || walletEntries.length === 0) {
        this.bot.sendMessage(message.chat.id, "No wallet addresses provided.");
        return;
      }
      const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
      for (const entry of walletEntries) {
        const walletAddress = entry;
        const isValid =
          base58Regex.test(walletAddress as string) &&
          PublicKey.isOnCurve(new PublicKey(walletAddress as string).toBytes());
        if (!isValid) {
          this.bot.sendMessage(
            message.chat.id,
            `Address provided is not a valid solana wallet`
          );
          continue;
        }
        const user = await this.db.findOne(userId);
        const isWalletAlready = user?.trackWallets.find(
          (wallet: Wallet) => wallet.address === walletAddress
        );
        if (!isWalletAlready) {
          this.bot.sendMessage(
            message.chat.id,
            `You are already not following the wallet: ${walletAddress}`
          );
          continue;
        }
        await this.db.removeWallet(userId, walletAddress);
        this.bot.sendMessage(
          message.chat.id,
          `🙌 Wallet ${walletAddress} has been removed.`
        );
      }
      this.bot.removeListener("message", listener);
      userExpectingAddWalletAddress[String(userId)] = false;
    };
    this.bot.once("message", listener);
  }
}
