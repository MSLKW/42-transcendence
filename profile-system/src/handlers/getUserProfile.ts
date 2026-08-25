import { Request, Response } from "express";
import { UserData, UserSettings, NULL_ACHIEVEMENTS } from "../types";

export function getUserProfile()
{
	return (async (req: Request, res: Response) =>
	{
		const uuid = req.params.uuid as string;

		//TODO: get user profile from Postgres with uuid

		const userData: UserData = {
			uuid:			uuid,
			username:		null,
			avatarPath:		null,
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