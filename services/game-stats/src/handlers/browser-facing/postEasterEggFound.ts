import { Request, Response } from "express";
import { GameStatsRepository } from "../../repositories/interfaces/GameStatsRepository";

export function postEasterEggFound(repository: GameStatsRepository)
{
	return async (req: Request, res: Response) =>
	{
		;
	};
}