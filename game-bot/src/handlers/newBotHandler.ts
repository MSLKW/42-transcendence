import { Request, Response } from "express";
import { BotManager } from "../bot/BotManager";
import { RandomController } from "../ai/RandomController";

const GAME_SERVICE_URL = process.env.GAME_SERVICE_URL as string;

if (!GAME_SERVICE_URL)
	throw Error("GAME_SERVICE_URL not set");

type ReqBody = {
	lobbyId:		string,
	seat:			number,
	sessionToken:	string
};

export function newBotHandler(manager: BotManager)
{
	return async (req: Request, res: Response) =>
	{
		if (!req.body)
			return res.status(400).json({ error: "No request body" });

		const { lobbyId, seat, sessionToken } = req.body as ReqBody;

		if (typeof lobbyId !== "string" || typeof seat !== "number" || typeof sessionToken !== "string")
			return res.status(400).json({ error: "Invalid request body" });
		if (seat < 0 || seat >= 4)
			return res.status(400).json({ error: "Seat must be between 0-3" });
	
		const botId = manager.addBot("bot", GAME_SERVICE_URL, new RandomController);
		res.status(200).json({ botId: botId });
		
		if (!await manager.getBot(botId)!.start(GAME_SERVICE_URL, lobbyId, seat, sessionToken))
			manager.removeBot(botId);
	};
}