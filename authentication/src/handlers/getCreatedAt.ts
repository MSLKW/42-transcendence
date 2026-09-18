import { Request, Response } from "express"
import { UserStore } from "../store/userStore";

export function getCreatedAt(userStore: UserStore)
{
	return async (req: Request, res: Response) =>
	{
		const uuid = req.params.uuid as string;

		const user = await userStore.getUserById(uuid);
		if (!user)
			return res.status(404).json({ error: "no user found"});
		
		return res.status(200).json({ createdAt: user.createdAt });
	};
}