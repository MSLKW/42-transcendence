import { Request, Response } from "express"
import { UserStore } from "../store/UserStore";
import { UserDataSchema } from "@big2/profile-types/validation";
import { authenticate } from "../utils/authenticate";

const USERNAME_REGEX = /^[A-Za-z0-9_-]{3,20}$/;

export function setUserProfile(store: UserStore)
{
	return (async (req: Request, res: Response) =>
	{
		try
		{
			const authRes = await authenticate(req);
			const authData = await authRes.json();
			if (!authRes.ok)
				return res.status(authRes.status).json(authData);
			const uuid = authData.userId;
			
			const zodValidation = UserDataSchema.safeParse(req.body);
			if (!zodValidation.success)
				return res.status(400).json({ error: zodValidation.error.issues });
			const body = zodValidation.data;

			if (body.username !== null && body.username !== undefined)
			{
				if (!USERNAME_REGEX.test(req.body.username))
					return res.status(422).json({ error: "username must only contain alphanumeric characters or -,_ and must be within 3 to 20 characters long" });
			}

			await store.updateUserProfile(uuid, body);
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