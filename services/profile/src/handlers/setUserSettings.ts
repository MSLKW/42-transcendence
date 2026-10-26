import { Request, Response } from "express";
import { UserStore } from "../store/UserStore";
import { UserSettingsSchema } from "@big2/profile-types/validation";
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

			const zodValidation = UserSettingsSchema.safeParse(req.body);
			if (!zodValidation.success)
				return res.status(400).json({ error: zodValidation.error.issues });

			await store.updateUserSettings(uuid, req.body);
			return res.status(200).json({ message: "settings successfully updated" });
		}
		catch (err)
		{
			console.error(err)
			return res.status(500).json({error: "Something went wrong"});
		}
	});
}