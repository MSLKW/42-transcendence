import { Request, Response } from "express";
import { postgres } from "../store/postgres";
import { eq } from "drizzle-orm";
import { users } from "@big2/auth-schema";

export function setInternalUsernameFromProfile() {
	return (async (req: Request, res: Response) =>{
		const uuid = req.params.uuid as string;
		if (!uuid)
			return (res.status(404).json({ error: "User not found in authentication to write username" }));
			
		const { username } = req.body;
		if (typeof username !== "string")
			return (res.status(400).json({ error: "username must be a string" }));

		try 
		{
			await postgres
				.update(users)
				.set({ username })
				.where(eq(users.id, uuid));

			return (res.status(204).end());
		}
		catch (err: any)
		{
			if (err.code === "23505") // postgres's unique violation (username auto throw error as it is unique() in postgres)
				return (res.status(409).json({ err: `username ${username} is already taken.` })); // 409 = conflict status code
			console.error("Failed to set username", err);
			return (res.status(500).json({ error: "Something went wrong in setting username to authentication service"}));
		}
	});
}