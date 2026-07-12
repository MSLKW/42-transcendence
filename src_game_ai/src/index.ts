import { config } from "./config";
import { BotManager } from "./bot/BotManager";
import { RandomController } from "./ai/RandomController";
import { PassiveController } from "./ai/PassiveController";
import { AggressiveController } from "./ai/AggressiveController";

const manager = new BotManager();
manager.addBot("rando0", "http://localhost:3000", new RandomController);
manager.addBot("rando1", "http://localhost:3000", new RandomController);
manager.addBot("rando2", "http://localhost:3000", new RandomController);
manager.addBot("rando3", "http://localhost:3000", new RandomController);
manager.startAll();

process.on("SIGINT", () => {
	manager.stopAll();
	process.exit(0);
});
