import { Request, Response } from "express";
// import { UserData, UserSettings, NULL_ACHIEVEMENTS } from "@big2/profile-system-types";
import { DrizzleUserProfileStore } from "../store/drizzleUserProfileStore";

export function getProfile()
{
	return (async (req: Request, res: Response) =>
	{
		try 
		{
			const uuid = req.params.uuid as string;
			
			//TODO: get user data from Postgres with uuid
			const userProfileStore = new DrizzleUserProfileStore();
			const userFullCompletedProfile = await userProfileStore.getFullCompletedProfile(uuid); 
			if (!userFullCompletedProfile)
				return (res.status(404).json({ error: "User not found" }));
			
			return (res.status(200).json({ userFullCompletedProfile }));
		}
		catch (err) 
		{
			console.error(err);
			return (res.status(500).json({ error: "Something went wrong"}));
		}
	});
}