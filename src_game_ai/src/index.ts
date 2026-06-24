import { config } from "./config";
import { BotManager } from "./bot/BotManager";

const manager = new BotManager();
manager.addBot("http://localhost:3000");
manager.startAll();

process.on("SIGINT", () => {
	manager.stopAll();
	process.exit(0);
});
