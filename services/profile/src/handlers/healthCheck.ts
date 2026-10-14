import { Request, Response } from "express";
import { AUTH_SERVICE_URL, AVATAR_DIR } from "../config/env";

export function healthCheck()
{
	return ((req: Request, res: Response) =>
	{
		if (!AUTH_SERVICE_URL || !AVATAR_DIR)
			return (res.status(500).json({ error: "something went wrong" }));
		return (res.status(200).json({ message: "service is healthy" }));
	});
}