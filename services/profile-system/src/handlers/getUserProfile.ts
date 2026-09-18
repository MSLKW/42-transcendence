import { Request, Response } from "express";
import { UserStore } from "../store/UserStore";

export function getUserProfile(store: UserStore)
{
	return (async (req: Request, res: Response) =>
	{
		const uuid = req.params.uuid as string;

		const userData = await store.getUserData(uuid);

		if (!userData)
			return (res.status(404).json({error: `uuid <${uuid}> not found`}));

		return (res.status(200).json(userData));
	});
}