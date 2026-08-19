import { Request, Response } from "express";
import { SessionStore } from "../store/sessionStore";
import { validateSession } from "../auth/validation";

export function validateSessionHandler(sessionStore: SessionStore) {
	return async (req: Request, res: Response) => {
		let token: string;

		const authCookie = req.cookies["session_token"];
		if (!authCookie)	
		{
			const authHeader = req.headers.authorization;
			if (typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
				return res.status(401).json(
					{ error: "Missing or malformed Authorization header." }
				);
			}
			token = authHeader.slice("Bearer ".length);
			console.warn("session_token cookie not set, using deprecated auth header");
		}
		else
			token = authCookie;

		if (!token || token.length === 0) {
			return res.status(401).json(
				{ error: "Missing or malformed session token." }
			);
		}

		try {
			const session = await validateSession(sessionStore, token);

			if (session === null)
			{
				res.clearCookie("session_token");
				return res.status(401).json({ error: "Invalid or expired session." });
			}
			return res.status(200).json({ userId: session.userId });
		} catch (err) {
			console.error("Session validation error:", err);
			return res.status(500).json({ error: "Something went wrong." });
		}
	};
}