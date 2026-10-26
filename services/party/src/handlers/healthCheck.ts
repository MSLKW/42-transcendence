import { Request, Response } from "express";

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL

export function healthCheck()
{
	return (req: Request, res: Response) =>
	{
		if (!AUTH_SERVICE_URL)
			return res.status(500).json({ error: "service is unhealthy" });
		return (res.status(200).json({ message: "service is healthy" }));
	}
}