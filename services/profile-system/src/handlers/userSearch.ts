import { Request, Response } from "express";
import { DrizzleUserInfoStore } from "../store/drizzleUserInfoStore";

export function userSearch()
{
	return (async (req: Request, res: Response) =>
	{
		try
		{
			const searchTerm = req.body.searchTerm;
			// const searchResults: string[] = [];

			//TODO: fill in searchResults from Postgres
			const userInfoStore = new DrizzleUserInfoStore;
			const searchResults: string[] = await userInfoStore.searchUsersByUsername(searchTerm);

			return (res.status(200).json({searchResults: searchResults}));
		}
		catch (err)
		{
			console.error(err);
			return (res.status(500).json({error: "Something went wrong"}));
		}
	});
}