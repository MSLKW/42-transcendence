import { Request, Response } from "express";
import { GameStatsRepository } from "../../repositories/GameStatsRepository";
import { GameEndStatsTransmitSchema } from "@big2/game-types/validation";
import { GameEndStatsResponseSchema } from "@big2/game-stats-types/game-stats";
import { isBotUuid } from "../../utils/botIdentifier";
import { isForeignKeyViolation } from "@big2/postgres-client";
import { GameEndStatsInput, GameEndStatsInputSchema } from "../../types/GameEndStatsInput";
import z from "zod";

export function postGameEndStats(repository: GameStatsRepository)
{
	return async (req: Request, res: Response) =>
	{
		// 1. correct request shape
		const parsed = GameEndStatsTransmitSchema.safeParse(req.body);
		if (!parsed.success)
		{
			console.error(z.prettifyError(parsed.error));
			return (res.status(400).json({ 
				error: "invalid_request_body",
				message: z.prettifyError(parsed.error),
			}));
		}

		// 2. valid all player uuid entries
		// 2.1 check game-server's request body of:
		// 		is the winner among the players playing in this round ?
		if (!Object.hasOwn(parsed.data.playerXpGains, parsed.data.winnerPlayerUuid))
			return (res.status(400).json({ error: "winner_is_not_among_players" }));

		// 2.2 extract human stats only (winner & each player)
		// filter away any bots' stats
		const winnerHumanUuid = (
			isBotUuid(parsed.data.winnerPlayerUuid))
			? null : parsed.data.winnerPlayerUuid;

		const humanXpGains: Record<string, number> = {};
		for (const [uuid, xpGained] of Object.entries(parsed.data.playerXpGains))
		{
			if (!isBotUuid(uuid))
				humanXpGains[uuid] = xpGained;
		}

		// save the stats inputs excluding bots.
		const parsedInput = GameEndStatsInputSchema.safeParse({
			roundId:	parsed.data.uuid,
			winnerHumanUuid,	// TS shorthand - same as winnerHumanUuid: winnerHumanUuid
			humanXpGains,		// TS shorthand - same as humanXpGains: humanXpGains
		});

		// all extracted players must be valid uuid (humans) | null (bots)
		if (!parsedInput.success) 
		{
			console.error("Invalid uuid for humans players and/or game-round:\n" + z.prettifyError(parsedInput.error));
			return (res.status(400).json({ // 400 instead of 404, coz invalid req body
				error: "invalid_uuid_for_humans_players_and_or_game_round",
				message: "Invalid uuid for human players and/or game-round:\n" + z.prettifyError(parsedInput.error),
			}));
		}		
		const input: GameEndStatsInput = parsedInput.data;

		try
		{
			// 4. return drizzle query's result
			// updated & accumulated stats
			const playersUpdatedStats = await repository.applyGameEndStats(input);

			// 5. valid response shape
			// strip off updatedAt column - z.object in zod schema drops unknown keys by default
			const cleanData = GameEndStatsResponseSchema.parse(playersUpdatedStats);
			return(res.json( cleanData ));
		} 
		catch (error: any)
		{
			// non-exist playerUuid, thrown postgres error foreign_key_violation
			if (isForeignKeyViolation(error))
				return (res.status(404).json({ error: "invalid_player_uuid", message: "Invalid playerUuid" }));
			throw error;		
		}
	};
}
