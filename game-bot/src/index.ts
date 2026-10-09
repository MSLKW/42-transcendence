import "dotenv/config";
import express from "express";

import { config } from "./config.js";
import { BotManager } from "./bot/BotManager.js";
import { healthCheck } from "./handlers/healthCheck.js";
import { newBotHandler } from "./handlers/newBotHandler.js";
import { RandomController } from "./ai/RandomController.js";
import { PassiveController } from "./ai/PassiveController.js";
import { AggressiveController } from "./ai/AggressiveController.js";

const PORT = Number(process.env.PORT) || 3000;

const manager = new BotManager();

const app = express();
app.use(express.json());

app.get("/health", healthCheck());
app.post("/new-bot", newBotHandler(manager));

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
	if (err.type === "entity.parse.failed") {
		return res.status(400).json({ error: "Malformed JSON in request body." });
	}
	console.error("Unhandled error:", err);
	return res.status(500).json({ error: "Something went wrong." });
});

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
