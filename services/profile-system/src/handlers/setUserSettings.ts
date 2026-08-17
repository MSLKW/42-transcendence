import { Request, Response } from "express";
import { authenticate } from "../utils/authenticate";
import { DrizzleUserSettingsStore } from "../store/drizzleUserSettingsStore";

export function setUserSettings()
{
	return (async (req: Request, res: Response) =>
	{
		try
		{
			const authRes = await authenticate(req); 
			const data = await authRes.json();
			if (!authRes.ok)
				return (res.status(authRes.status).json(data));
			const userSettings = req.body.userSettings;
			
			//TODO: put settings into Postgres
			const userSettingsStore = new DrizzleUserSettingsStore();
			await userSettingsStore.setUserSettings(data.id, userSettings);
			return (res.status(204).send());
		}
		catch (err)
		{
			console.error(err)
			return (res.status(500).json({error: "Something went wrong"}));
		}
	});
}