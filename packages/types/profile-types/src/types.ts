import { type BadgeLabel } from "@big2/badge-types";

export type UserData = {
	username:		string | null,
	avatarPath:		string | null,
	badge:			BadgeLabel,
	// selectedBadge: BadgeLabel, // TODO: replace the above with this later
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
	