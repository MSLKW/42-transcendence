import { Request, Response } from "express";
import { DrizzleUserStore } from "../store/drizzleUserStore"
import { users, sessions } from "@big2/auth-schema";
import { postgres } from "../store/postgres"
import { eq } from "drizzle-orm";


export function getInternalInfosForProfile() {
	return async ( req: Request, res: Response ) => {
		
		const id = req.params.id;
		// const id2 = req.body.id; => //? whats the difference between this and above?
		
		const [user] = await postgres
			.select({ createdAt: users.createdAt })
			.from(users)
			.where(eq(users.id, req.body.id));
		if (!user)
			return ( res.status(404).json({ error: "User not found" }));

		const [session] = await postgres
			.select({ createdAt: sessions.createdAt })
			.from(sessions)
			.where(eq(sessions.userId, id));
		
		return res.status(200).json({ createdAt: user.createdAt, lastLogin: session?.createdAt ?? null});
	};
}