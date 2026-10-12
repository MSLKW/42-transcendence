import { Request, Response } from "express";
import { UserStore } from "../store/UserStore";
import { authenticate } from "../utils/authenticate";

export function setUserSettings(store: UserStore)
{
	return (async (req: Request, res: Response) =>
	{
		try
		{
			const authRes = await authenticate(req); 
			const data = await authRes.json();
			if (!authRes.ok)
				return (res.status(authRes.status).json(data));

			const uuid = data.userId;
			await store.updateUserSettings(uuid, req.body);
			return (res.status(204).end());
		}
		catch (err)
		{
			console.error(err)
			return (res.status(500).json({error: "Something went wrong"}));
		}
	});
}