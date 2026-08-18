import { Request, Response } from "express";
import { AUTH_SERVICE_URL, AVATAR_DIR } from "../config";

export function healthCheck()
{
	return ((req: Request, res: Response) =>
	{
		if (!AUTH_SERVICE_URL || !AVATAR_DIR)
			return (res.status(500));
		return (res.status(204).send());
	});
}