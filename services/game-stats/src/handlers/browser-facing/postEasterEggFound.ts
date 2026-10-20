import { Request, Response } from "express";
import { GameStatsRepository } from "../../repositories/interfaces/GameStatsRepository";

export function postEasterEggFound(repository: GameStatsRepository)
{
	return async (req: Request, res: Response) =>
	{
		return res.status(418).end(); // just a placeholder haha, will edit this more in polishing later
	};
}