import dotenv from "dotenv";
import { bot } from "./providers/telegram";
import { StartCommand } from "./bot/commands/start-command";
import { AddCommand } from "./bot/commands/add-command";
import { CallbackQueryHandler } from "./bot/handlers/callback-query-handler";
import express, { Express } from "express";
import { DeleteCommand } from "./bot/commands/delete-command";
import { TrackWallets } from "./lib/track-wallets";

dotenv.config();
const PORT = 3001;

class Main {
  private trackWallets: TrackWallets;
  private callbackQueryHandler: CallbackQueryHandler;
  private startCommand: StartCommand;
  private addCommand: AddCommand;
  private deleteCommand: DeleteCommand;
  constructor(private app: Express = express()) {
    this.app.use(express.json({ limit: "50mb" }));
    this.setupRoutes();
    this.trackWallets = new TrackWallets();
    this.callbackQueryHandler = new CallbackQueryHandler(bot);
    this.startCommand = new StartCommand(bot);
    this.addCommand = new AddCommand(bot);
    this.deleteCommand = new DeleteCommand(bot);
    this.app.listen(PORT, () =>
      console.log(`[Express]=> Server running on: http://localhost:${PORT}`)
    );
  }
  setupRoutes() {
    this.app.get("/", async (req, res) => {
      try {
        res.status(200).send("Hello world");
      } catch (error) {
        console.error("Default route error", error);
        res.status(500).send("Error processing default rpute");
      }
    });
  }
  public async init(): Promise<void> {
    this.callbackQueryHandler.call();
    this.startCommand.start();
    this.addCommand.addCommandHandler();
    this.deleteCommand.deleteCommandHandler();
    await this.trackWallets.setupWalletWatcher();
  }
}
const main = new Main();
main.init();
