export type UserData = {
	uuid:			string,
	username:		string | null,
	avatar_path:	string,
	userSettings:	UserSettings,
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

export type UserSettings = {
	autoPassKey:		AutoPassKeys;
	allow3OfAKind:		boolean;
	allow2OfSpadesEnd:	boolean;
	autoPassIndex:		number;
	endGameCondition:	number;
	scoreCalculation:	number;
	cardStyle:			number;
	uiColor:			number;
	fxLevel:			number;
	mxLevel:			number;
};

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