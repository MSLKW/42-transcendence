import { Request, Response } from "express";
import { UserStore } from "../store/UserStore";
import { UserData, UserSettings, NULL_ACHIEVEMENTS } from "@big2/profile-system-types";

export function getUserSettings(store: UserStore)
{
	return (async (req: Request, res: Response) =>
	{
		const uuid = req.params.uuid as string;

		const userSettings = await store.getUserSettings(uuid);
		if (userSettings)
			return res.status(200).json(userSettings);
		return res.status(404).json({error: `uuid <${uuid}> not found`})
	});
}