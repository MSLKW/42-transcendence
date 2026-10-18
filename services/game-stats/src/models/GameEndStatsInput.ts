export type GameEndStatsInput = {
	roundId:			string;					// uuid
	winnerPlayerUuuid:	string;					// may be a bot id, so its a string, not uuid
	xpGains:			Record<string, number>;	// for each players/bots in the round -> non-negative integers: guaranteed by game-types's GameEndStatsTransmitSchema
};