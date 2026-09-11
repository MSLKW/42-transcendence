import { Request, Response } from "express";
import { users, sessions } from "@big2/auth-schema";
import { postgres } from "../store/postgres"
import { eq } from "drizzle-orm";


export function getInternalInfosForProfile() {
	return async ( req: Request, res: Response ) => {
		
		const uuid = req.params.uuid as string; // use this over req.body.id coz id is passed through URL in REST API
		
		const [user] = await postgres
			.select({ createdAt: users.createdAt })
			.from(users)
			.where(eq(users.id, uuid));
		if (!user)
			return ( res.status(404).json({ error: "User not found" }));

		const [session] = await postgres
			.select({ createdAt: sessions.createdAt })
			.from(sessions)
			.where(eq(sessions.userId, uuid));
		
		return res.status(200).json({ createdAt: user.createdAt, lastLogin: session?.createdAt ?? null});
	};
}

// uuid "as string" ADDITION
// =>	TypeScript's official type for any req.params.anything is string | string[] — "could be one string, or could be an array of strings" 
// 		— never a plain guaranteed string. But eq(users.id, ...) demands a plain string on the right side (since users.id is a uuid column). 
// 		TypeScript won't silently assume it's safe, so it blocks the whole line.
// Fix — force it, since you know in practice it's always one string here:
// 		.where(eq(users.id, req.params.id as string));