import { Request, Response } from "express";
import { UserStore } from "../store/UserStore";

const otherUserDataEndpoins: string[] = [];

export function getUserProfile(store: UserStore)
{
	return (async (req: Request, res: Response) =>
	{
		const uuid = req.params.uuid as string;

		let userData = await store.getUserData(uuid);

		if (!userData)
			return (res.status(404).json({error: `uuid <${uuid}> not found`}));

		for (const endpoint in otherUserDataEndpoins)
		{
			const res = await fetch(endpoint);
			if (!res.ok)
				continue ;
			const data = await res.json();
			userData = {...userData, ...data};
		}
		return (res.status(200).json(userData));
	});
}