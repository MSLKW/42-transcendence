import { Request, Response } from "express";
import { SessionStore } from "../store/sessionStore";
import { hashToken } from "../auth/hash";

export function logoutHandler(sessionStore: SessionStore)
{
	return async (req: Request, res: Response) =>
	{
		res.clearCookie("session_token");
		
		let token: string;
		const authCookie = req.cookies["session_token"];
		if (!authCookie)
		{
			const authHeader = req.headers.authorization;
			if (typeof authHeader !== "string" || !authHeader.startsWith("Bearer "))
			{
				return res.status(401).json(
					{ error: "Missing or malformed Authorization header." }
				);
			}
			token = authHeader.slice("Bearer ".length);
		}
		else
			token = authCookie;

		if (token.length === 0)
		{
			return res.status(401).json(
				{ error: "Missing or malformed Authorization header." }
			);
		}
		
		try
		{
			await sessionStore.deleteSession(hashToken(token));
			return res.status(200).json({ message: "Logged out successfully." });
		}
		catch (err)
		{
			console.error("Logout error:", err);
			return res.status(500).json({ error: "Something went wrong." });
		}
	};
}
