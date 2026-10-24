import { timingSafeEqual } from "node:crypto";
import { type Request, type Response, type NextFunction } from "express";
import { STATISTICS_TOKEN } from "../config/env";

const expected = Buffer.from(`Bearer ${STATISTICS_TOKEN}`);		// built once at startup

export function requireStatisticsToken(req: Request, res: Response, next: NextFunction)
{
	const given = Buffer.from(req.headers.authorization ?? "");	// syntax: ?? "" = use empty string if the header is missing
	if (given.length !== expected.length || !timingSafeEqual(given, expected))
		return (res.status(401).json({ error: "unauthorized" }));
	next();
}



// * Do you need timingSafeEqual?
// 
// Not strictly, but better to keep it. 
// A normal === on strings stops at the first character that differs. 
// In theory, an attacker could measure response times and find the token one character at a time, 
// because a guess with more correct leading characters takes slightly longer to reject. 
// timingSafeEqual takes the same time regardless. 
// On a private Docker network with a 64-character random token this attack is very hard in practice, 
// so the risk is small, but the function costs two lines and is the standard way to compare secrets.
// 
// It throws an error if the two buffers have different lengths, 
// which is why the length check comes first. 
// That reveals the token’s length, which doesn’t matter.


// TODO (game-server): fetch upon /game-end-stats needed to do is as below:
// const res = await fetch(`${GAME_STATS_SERVICE_URL}/game-end-stats`, {
// 	method: "POST",
// 	headers: {
// 		"Content-Type": "application/json",
// 		"Authorization": `Bearer ${STATISTICS_TOKEN}`,
// 	},
// 	body: JSON.stringify(payload),
// 	signal: AbortSignal.timeout(5000),
// });