import { Request, Response } from "express";

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;

if (!AUTH_SERVICE_URL)
	throw new Error("AUTH_SERVICE_URL is not set");

export function setProfile()
{
	return (async (req: Request, res: Response) =>
	{
		try
		{
			const authRes = await fetch(`${AUTH_SERVICE_URL}/validate`, {
				headers: {
					Cookie: req.headers.cookie || ""
				}
			});
			const data = await authRes.json();
			if (!authRes.ok)
				return (res.status(authRes.status).json(data));
			if (req.params.uuid != data.id)
				return (res.status(403));
			//TODO: put data into Postgres
			return (res.status(204));
		}
		catch (err)
		{
			console.error("")
			return (res.status(500).json({error: "Something went wrong"}));
		}
	});
}