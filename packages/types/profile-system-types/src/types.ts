export type UserData = {
	uuid:			string,
	username:		string | null,
	avatarPath:		string | null,
	badge:			BadgeLabel,
	achievements:	Record<AchievementLabel, Date | null>,
	userSettings:	UserSettings,
	createdAt:		Date,
	lastLogin:		Date,	
	level:			number,
	xp:				number,
	totalPlayed:	number,
	totalWins:		number,
	totalLoss:		number,
	winStreak:		number,
	online:			boolean,
	inGame:			boolean
};

export type UserSettings = {
	allow3OfAKind:		boolean,
	allow2OfSpadesEnd:	boolean,
	autoPassIndex:		number,
	endGameCondition:	number,
	scoreCalculation:	number,
	cardStyle:			number,
	uiColor:			number;
	fxLevel:			number,
	mxLevel:			number
};

export const NULL_ACHIEVEMENTS: Record<AchievementLabel, Date | null> = {
	"FIRST_LOGIN": null,
	"LOGIN_1_WEEK": null,
	"PLAYED_1_GAME": null,
	"PLAYED_10_GAMES": null,
	"PLAYED_42_GAMES": null,
	"FIRST_WIN": null,
	"WIN_STREAK_2": null,
	"WIN_STREAK_5": null,
	"WIN_STREAK_10": null,
	"MASTER_COLLECTOR": null
} as const;
	
type AutoPassKeys =
	"1s"
	| "3s"
	| "5s"
	| "10s"
	| "15s"
	| "30s"
	| "42s"
	| "1 min"
	| "2 mins"
	| "No Limit";

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