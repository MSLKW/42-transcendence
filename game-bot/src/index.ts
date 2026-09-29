import { config } from "./config";
import { BotManager } from "./bot/BotManager";
import { RandomController } from "./ai/RandomController";
import { PassiveController } from "./ai/PassiveController";
import { AggressiveController } from "./ai/AggressiveController";

const manager = new BotManager();
manager.addBot("passive", "http://localhost:3000", new PassiveController);
manager.addBot("aggro1", "http://localhost:3000", new AggressiveController);
manager.addBot("aggro2", "http://localhost:3000", new AggressiveController);
manager.addBot("aggro3", "http://localhost:3000", new AggressiveController);
manager.startAll();

process.on("SIGINT", () => {
	manager.stopAll();
	process.exit(0);
});
