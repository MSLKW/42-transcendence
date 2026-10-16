import { Request, Response, NextFunction } from "express";
import { AUTH_SERVICE_URL } from "../config/env";


export async function requireUser(req: Request, res: Response, next: NextFunction) 
{
	const cookie = req.headers.cookie;
	if (!cookie) 
		return res.status(401).end();

	try 
	{
		const authRes = await fetch(`${AUTH_SERVICE_URL}/validate`, { headers: { cookie } });
		if (!authRes.ok) 
			return res.status(401).end();

		const { uuid } = await authRes.json();   // adjust to what auth actually returns
		res.locals.playerUuid = uuid;            // hand it to the handler
		next();                                  // continue to the handler
	} 
	catch 
	{
		res.status(503).end();                   // auth unreachable
	}
}