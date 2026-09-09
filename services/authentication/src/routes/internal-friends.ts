import { Request, Response } from "express";
import { users } from "@big2/auth-schema";
import { postgresClient } from "../store/postgresClient"
import { eq } from "drizzle-orm";


export function checkUserExistanceForFriends() {
	return async ( req: Request, res: Response ) => {
		
		const id = req.params.id as string; // use this over req.body.id coz id is passed through URL in REST API
		
		const [userExists] = await postgresClient
			.select()
			.from(users)
			.where(eq(users.id, id))
			.limit(1);
		if (!userExists)
			return ( res.status(404).json({ error: "User uuid does not exist" }));
		
		return res.status(200).json({ exists: true });
	};
}

// uuid "as string" ADDITION
// =>	TypeScript's official type for any req.params.anything is string | string[] — "could be one string, or could be an array of strings" 
// 		— never a plain guaranteed string. But eq(users.id, ...) demands a plain string on the right side (since users.id is a uuid column). 
// 		TypeScript won't silently assume it's safe, so it blocks the whole line.
// Fix — force it, since you know in practice it's always one string here:
// 		.where(eq(users.id, req.params.id as string));