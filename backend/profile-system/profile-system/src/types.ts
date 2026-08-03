export type UserData = {
	uuid:			string,
	username:		string | null,
	avatar_path:	string,
	badge:			BadgeLabel,
	level:			number,
	xp:				number,
	createdAt:		Date,
	lastLogin:		Date,
	totalPlayed:	number,
	totalWins:		number,
	totalLoss:		number,
	winStreak:		number,
	achievements:	Record<AchievementLabel, Date>,
	online:			boolean,
	inGame:			boolean
};

type BadgeLabel =
	"Newcomer"
	| "Beginner's Luck"
	| "Challenger"
	| "Enthusiast"
	| "Risk Taker"
	| "The Strategist"
	| "Big 2 Champion";

type AchievementLabel = 
	"FIRST_LOGIN"
	| "LOGIN_1_WEEK"
	| "PLAYED_1_GAME"
	| "PLAYED_10_GAMES"
	| "PLAYED_42_GAMES"
	| "FIRST_WIN"
	| "WIN_STREAK_2"
	| "WIN_STREAK_5"
	| "WIN_STREAK_10"
	| "MASTER_COLLECTOR";