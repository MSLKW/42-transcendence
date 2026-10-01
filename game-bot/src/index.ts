import "dotenv/config";
import express from "express";

import { config } from "./config";
import { BotManager } from "./bot/BotManager";
import { RandomController } from "./ai/RandomController";
import { PassiveController } from "./ai/PassiveController";
import { AggressiveController } from "./ai/AggressiveController";

const PORT = Number(process.env.PORT) || 3000;

const manager = new BotManager();

const app = express();
app.use(express.json());

app.post("/new_bot", ()=>{});

const server = app.listen(PORT, ()=> {
	console.log(`Server running on http://localhost:${PORT}`);
});

process.on("SIGINT", () => {
	manager.stopAll();
	process.exit(0);
});
