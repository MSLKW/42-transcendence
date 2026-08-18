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
			const userInfoStore = new DrizzleUserInfoStore();
			const searchResults: string[] = await userInfoStore.searchUsersByUsername(searchTerm);

			return (res.status(200).json({searchResults}));
		}
		catch (err)
		{
			console.error(err);
			return (res.status(500).json({error: "Something went wrong"}));
		}
	});
}

// {searchResults: searchResults} 
// =>	{ label: theActualVariable } 
// 		ts lets you just write it once if both label and var is the same name, 
// 		Labels can be any word you want, they're not typed at all, not connected to any variable