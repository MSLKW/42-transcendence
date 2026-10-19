import { Request, Response } from "express";
import { GameStatsRepository } from "../../repositories/interfaces/GameStatsRepository";
import { GameEndStatsTransmitSchema } from "@big2/game-types/validation";
import { GameEndStatsResponseSchema, type GameEndStatsInput } from "@big2/game-stats-types";
import z from "zod";

export function postGameEndStats(repository: GameStatsRepository)
{
	return async (req: Request, res: Response) =>
	{
		const parsed = GameEndStatsTransmitSchema.safeParse(req.body);
		if (!parsed.success)
		{
			console.error(z.prettifyError(parsed.error));
			return (res.status(400).json({ 
				error: "invalid_request_body",
				message: z.prettifyError(parsed.error),
			}));
		}

		const input: GameEndStatsInput = {
			roundId:			parsed.data.uuid,
			winnerPlayerUuid:	parsed.data.winnerPlayerUuid,
			playerXpGains:		parsed.data.playerXpGains,
		};
		
		const playersUpdatedStats = await repository.applyGameEndStats(input);
		const cleanData = GameEndStatsResponseSchema.parse(playersUpdatedStats);
		
		return(res.status(200).json({cleanData}));
	};
}

// 2. Validating a single uuid without a schema object

// In zod 4, z.uuid() is itself a schema, so you can call safeParse on it directly:

// ts
// const parsed = z.uuid().safeParse(req.params.playerUuid);
// if (!parsed.success)
// 	return (res.status(400).json({ error: "invalid_uuid" }));
// const playerUuid = parsed.data;		// typed string

// z.uuid() is strict about the RFC format. If your auth service generates UUIDs that don’t pass (for example a nil or hand-made one), use z.guid(), which only checks the 8-4-4-4-12 shape.