import { Request, Response } from "express";
import { SessionStore } from "../store/sessionStore";
import { randomUUID } from "crypto";
import { SESSION_DURATION_MS } from "../config/sessionConfig";

export function guestHandler(sessionStore: SessionStore) {
	return async (req: Request, res: Response) => {
		
		try {
			const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
			const guestId = "guest_" + randomUUID();
			const session = await sessionStore.createSession(guestId, expiresAt);

			res.cookie("session_token", session.token, {
				httpOnly: true,
				secure: true,
				sameSite: "strict",
				expires: expiresAt,
			});

			return res.status(200).json({ id: guestId });
		} catch (err) {
			console.error("Signin error:", err);
			return res.status(500).json({ error: "Something went wrong." });
		}
	};
}
