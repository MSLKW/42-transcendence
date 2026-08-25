import { Request, Response } from "express";
import { UserData, UserSettings, NULL_ACHIEVEMENTS } from "../types";

export function getUserSettings()
{
	return (async (req: Request, res: Response) =>
	{
		const uuid = req.params.uuid as string;

		//TODO: get user settings from Postgres with uuid
		
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
		return (res.status(200).json({userData: userSettings}));
	});
}