import z from "zod";

export const GameEndStatsInputSchema = z.object({
	roundId:			z.uuid(),
	winnerHumanUuid:	z.uuid().nullable(), // null if bot won
	humanXpGains:		z.record(z.uuid(), z.int().nonnegative()), // record can be filled with null if all players are bots, human is just a spectator
});
export type GameEndStatsInput = z.infer<typeof GameEndStatsInputSchema>;

