import { Request, Response } from "express";
import { BotManager } from "../bot/BotManager";
import { RandomController } from "../ai/RandomController";

const GAME_SERVICE_URL = process.env.GAME_SERVICE_URL as string;

if (!GAME_SERVICE_URL)
	throw Error("GAME_SERVICE_URL not set");

export function newBotHandler(manager: BotManager)
{
	return (req: Request, res: Response) =>
	{
		if (!req.body)
			return res.status(400).json({ error: "No request body" });

		const { seat, botSessionToken } = req.body as { seat: number, botSessionToken: string };

		if (typeof seat !== "number" || typeof botSessionToken !== "string")
			return res.status(400).json({ error: "Invalid request body" });

		if (seat < 0 || seat >= 4)
			return res.status(400).json({ error: "Seat must be between 0-3" });
	
		const botId = manager.addBot("bot", GAME_SERVICE_URL, new RandomController);
		return res.status(200).json({ botId: botId });
	};
}