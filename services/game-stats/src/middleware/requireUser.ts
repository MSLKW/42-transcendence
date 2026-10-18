import { type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { AUTH_SERVICE_URL } from "../config/env";


const ValidateAuthResponseSchema = z.object({ uuid: z.uuid() });	// zod making sure its a uuid string. ValidateAuthResponseSchema object is built once

export async function requireUser(req: Request, res: Response, next: NextFunction) 
{
	const cookie = req.headers.cookie;
	if (!cookie) 
		return (res.status(401).end());					// 401 Unauthorized

	try 
	{
		// fetch returns a Promise. 
		// When the request fails, the Promise is rejected, 
		// and await turns a rejected Promise into a thrown exception right at that line,
		// jumps straight to your catch
		const authRes = await fetch(`${AUTH_SERVICE_URL}/validate`, 
		{
			headers: { cookie },
			signal: AbortSignal.timeout(3000),          // don't hang if auth is slow; a timeout throws TimeoutError, network problems throw TypeError: fetch failed
		});

		if (authRes.status === 401 || authRes.status === 403) 
			return (res.status(401).end());
		if (!authRes.ok) 
		{
			console.error(`requireUser: auth failed with status ${authRes.status}`);
			return (res.status(502).end());				// auth itself is failing
		}

		const body = await authRes.json().catch(() => null);	
		const parsed = ValidateAuthResponseSchema.safeParse(body);  // reuses the same ValidateAuthResponseSchema object , throws SyntaxError if body is empty/invalid JSON
		if (!parsed.success) 
		{
			console.error("requireUser: auth replied with an unexpected body\n" + z.prettifyError(parsed.error));
			return (res.status(502).end());
		}

		res.locals.playerUuid = parsed.data.uuid;		// hand it to the handler
		next();											// continue to the handler
	} 
	catch (err)
	{
		console.error("requireUser: could not reach auth", err);
		res.status(503).end();                          			// auth unreachable or timed out
	}

}

// res.locals.playerUuid is typed any
export function getPlayerUuid(res: Response): string 
{
	const playerUuid = res.locals.playerUuid;
	if (typeof playerUuid !== "string")
		throw new Error("playerUuid missing, was requireUser middleware left off this route?");
	return (playerUuid);
}


// # For a missing or wrong uuid, it prints something like below by prettifyError:
// requireUser: auth replied with an unexpected body
// ✖ Invalid UUID
//   → at uuid
// # raw issues => console.error(parsed.error.issues)
// # prettifyError already prints everything in issues

// res.locals 
//  - is a Express's official per-request storage, wiped at request end.
//  - the only way to pass anything from middlewares to handlers.
//  - middleware return values are ignored by Express by default.
// getPlayerUuid
//	- uuid is a string already, checked by zod in ValidateAuthResponseSchema
//	- uuid placed into res.locals that is typed any, 
//	- coz res.locals can hold anything so TypeScript doesn’t track what was put in or typos
// add runtime guard clause to throw 500 if UUID is missing due to a omitted middleware.
// add central error-handling middleware to catch throws and return clean 500 responses.

// zodSchemaX.safeParse(data) 
// safeParse returns:
// { success: true, data } or { success: false, error }