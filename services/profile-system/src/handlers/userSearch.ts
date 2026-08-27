import { Request, Response } from "express";
// import { DrizzleUserDataStore } from "../store/drizzleUserDataStore";
import { UserStore } from "../store/UserStore";


export function userSearch(store: UserStore)
{
	return (async (req: Request, res: Response) =>
	{
		try
		{
			// const searchTerm = req.body.searchTerm;
			// const searchResults: string[] = [];
			// //TODO: fill in searchResults from Postgres
			// const userDataStore = new DrizzleUserDataStore();
			// const searchResults: string[] = await userDataStore.searchUsersByUsername(searchTerm);
			// return (res.status(200).json({searchResults}));
			
			const query = req.params.query as string;
			const searchResults: string[] = await store.getUuidsByQuery(query);

			return (res.status(200).json({searchResults: searchResults}));
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