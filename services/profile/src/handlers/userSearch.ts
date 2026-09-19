import { Request, Response } from "express";
import { UserStore } from "../store/UserStore";

export function userSearch(store: UserStore)
{
	return (async (req: Request, res: Response) =>
	{
		try
		{
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

export function userSearchExact(store: UserStore)
{
	return (async (req: Request, res: Response) =>
	{
		try
		{
			const username = req.params.username as string;
			const searchResult = await store.getUuidByUsername(username);

			if (searchResult)
				return res.status(200).json({ uuid: searchResult });
			return res.status(404).json({ error: "no user found" });
		}
		catch (err)
		{
			console.error(err);
			return res.status(500).json({ error: "Something went wrong" });
		}
	});
}