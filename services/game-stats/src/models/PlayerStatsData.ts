import { BadgeLabel } from "@big2/game-stats-types";

export type PlayerStatsData = {
	uuid:			string;
	level:			number;
	xp:				number;
	totalPlayed:	number;
	totalWins:		number;
	winStreak:		number;
	displayedBadge:	BadgeLabel;
};

