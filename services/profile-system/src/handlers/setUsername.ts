import { Request, Response } from "express";
import { authenticate } from "../utils/authenticate";
import { DrizzleUserInfoStore } from "../store/drizzleUserInfoStore";

export function setUsername()
{
	return (async (req: Request, res: Response) =>
	{
		try
		{
			const authRes = await authenticate(req); 
			const data = await authRes.json();
			if (!authRes.ok)
				return (res.status(authRes.status).json(data));
			const username = req.body.username;
			
			//TODO: put username into Postgres
			const userInfoStore = new DrizzleUserInfoStore();
			await userInfoStore.setUsername(data.id, username);
			return (res.status(204).send());
		}
		catch (err)
		{
			console.error(err)
			return (res.status(500).json({error: "Something went wrong"}));
		}
	});
}