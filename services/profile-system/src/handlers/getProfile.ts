import { Request, Response } from "express";
import { UserData, UserSettings, NULL_ACHIEVEMENTS } from "../types";

export function getProfile()
{
	return (async (req: Request, res: Response) =>
	{
		const uuid = req.params.uuid as string;

		//TODO: get user data from Postgres with uuid
		
		const userSettings: UserSettings = {
			allow3OfAKind:		true,
			allow2OfSpadesEnd:	true,
			autoPassIndex:		0,
			endGameCondition:	0,
			scoreCalculation:	0,
			cardStyle:			0,
			uiColor:			0,
			fxLevel:			0,
			mxLevel:			0
		};

		const userData: UserData = {
			uuid:			uuid,
			username:		null,
			avatar_path:	"",
			userSettings:	userSettings,
			badge:			"Beginner's Luck",
			level:			0,
			xp:				0,
			createdAt:		new Date(),
			lastLogin:		new Date(),
			totalPlayed:	0,
			totalWins:		0,
			totalLoss:		0,
			winStreak:		0,
			achievements:	structuredClone(NULL_ACHIEVEMENTS),
			online:			false,
			inGame:			false
		};
		return (res.status(200).json({userData: userData}));
	});
}