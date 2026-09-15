import { Request, Response } from "express"
import { UserStore } from "../store/UserStore";
import { type UserData } from "@big2/profile-system-types";
import { authenticate } from "../utils/authenticate";
import { fetchJson } from "../utils/fetchJson";
import { AUTH_SERVICE_URL } from "../config";

export function setUserProfile(store: UserStore)
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

			const partial: Partial<UserData> = {};
			if (typeof(req.body.username) === "string")
				partial.username = req.body.username;
			if (typeof(req.body.avatarPath) === "string")
				partial.avatarPath = req.body.avatarPath;
			if (typeof(req.body.badgeLabel) === "string")
				partial.badge = req.body.badgeLabel;

			// update auth service who also have username but not as FK since username is nullable
			if (partial.username !== undefined)
			{
				await fetchJson(`${AUTH_SERVICE_URL}/internal/profile/username/${uuid}`, {
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ username: partial.username }),
				});
			}

			await store.updateUserProfile(uuid, partial);
			return (res.status(204).end());
		}
		catch (err)
		{
			console.error(err)
			return (res.status(500).json({error: "Something went wrong"}));
		}
	});
}