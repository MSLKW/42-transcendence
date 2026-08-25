import { Request, Response } from "express"
import { authenticate } from "../utils/authenticate";

export function setUserProfile()
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
			const badgeLabel = req.body.badgeLabel;
			const avatarPath = req.body.avatarPath;
			
			//TODO: put username into Postgres

			return (res.status(204));
		}
		catch (err)
		{
			console.error(err)
			return (res.status(500).json({error: "Something went wrong"}));
		}
	});
}