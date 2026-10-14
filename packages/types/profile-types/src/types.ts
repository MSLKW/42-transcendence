export type UserData = {
	username:		string | null,
	avatarPath:		string | null,
	badge:			BadgeLabel, // temp only to not crash until profile service remove completely badge label from backend
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
	
// temp only to not crash until profile service remove completely badge label from backend
export type BadgeLabel =
	"Newcomer"
	| "Beginner's Luck"
	| "Challenger"
	| "Enthusiast"
	| "Risk Taker"
	| "The Strategist"
	| "Big 2 Champion";