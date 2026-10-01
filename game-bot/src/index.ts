import "dotenv/config";
import express from "express";

import { config } from "./config";
import { BotManager } from "./bot/BotManager";
import { healthCheck } from "./handlers/healthCheck";
import { newBotHandler } from "./handlers/newBotHandler";
import { RandomController } from "./ai/RandomController";
import { PassiveController } from "./ai/PassiveController";
import { AggressiveController } from "./ai/AggressiveController";

const PORT = Number(process.env.PORT) || 3000;

const manager = new BotManager();

const app = express();
app.use(express.json());

app.get("/health", healthCheck());
app.post("/new_bot", newBotHandler(manager));

const server = app.listen(PORT, ()=> {
	console.log(`Server running on http://localhost:${PORT}`);
});

server.on("error", (err: NodeJS.ErrnoException) =>
{
	console.error(err.message);
});

process.on("SIGINT", () => {
	manager.stopAll();
	server.close();
	process.exit(0);
});
