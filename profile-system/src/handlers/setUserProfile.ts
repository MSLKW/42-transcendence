import { Request, Response } from "express"
import { UserStore } from "../store/UserStore";
import { UserData } from "../types";
import { authenticate } from "../utils/authenticate";

export function setUserProfile(store: UserStore)
{
	return (async (req: Request, res: Response) =>
	{
		try
		{
			const authRes = await authenticate(req); 
			const data = await authRes.json();
			if (!authRes.ok)
				return res.status(authRes.status).json(data);
			
			const uuid = data.userId;

			const partial: Partial<UserData> = {};
			if (typeof(req.body.username) === "string")
				partial.username = req.body.username;
			if (typeof(req.body.avatarPath) === "string")
				partial.avatarPath = req.body.avatarPath;
			if (typeof(req.body.badgeLabel) === "string")
				partial.badge = req.body.badgeLabel;

			await store.updateUserProfile(uuid, partial);
			return res.status(200).json({ message: "profile successfully updated" });
		}
		catch (err: any)
		{
			if (err.message === "DUPLICATE_USERNAME")
				return res.status(409).json({ error: "username is taken" });

			console.error("setUserProfile error: ", err);
			return res.status(500).json({ error: "Something went wrong" });
		}
	});
}