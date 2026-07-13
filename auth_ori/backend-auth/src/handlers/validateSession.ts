import { Request, Response } from "express";
import { SessionStore } from "../store/sessionStore";
import { validateSession } from "../auth/validation";

export function validateSessionHandler(sessionStore: SessionStore) {
	return async (req: Request, res: Response) => {
		const authHeader = req.headers.authorization;
		if (typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
			return res.status(401).json(
				{ error: "Missing or malformed Authorization header." }
			);
		}

		const token = authHeader.slice("Bearer ".length);

		if (token.length === 0) {
			return res.status(401).json(
				{ error: "Missing or malformed Authorization header." }
			);
		}

		try {
			const session = await validateSession(sessionStore, token);

			if (session === null) {
				return res.status(401).json({ error: "Invalid or expired session." });
			}
			return res.status(200).json({ userId: session.userId });
		} catch (err) {
			console.error("Session validation error:", err);
			return res.status(500).json({ error: "Something went wrong." });
		}
	};
}
