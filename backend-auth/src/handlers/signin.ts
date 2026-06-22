import { Request, Response } from "express";
import { UserStore } from "../store/userStore";
import { SessionStore } from "../store/sessionStore";
import { verifyPassword } from "../auth/hash";
import { validateEmail } from "../auth/validation";
import { SESSION_DURATION_MS } from "../config/sessionConfig";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export function signinHandler(userStore: UserStore, sessionStore: SessionStore) {
	return async (req: Request, res: Response) => {
		if (req.headers["content-type"] != "application/json")
			return res.status(415).json(
				{ error: "Content-Type must be application/json" }
			);
		
		const { identifier, password } = req.body ?? {};
		if (typeof identifier !== "string" || typeof password !== "string") {
			return res.status(400).json({ error: "Identifier and password are required." });
		}

		try {
			const user = validateEmail(identifier)
				? await userStore.getUserByEmail(identifier)
				: await userStore.getUserByUsername(identifier);

			if (user === null) {
				return res.status(401).json({ error: "Invalid identifier or password." });
			}

			if (user.lockedUntil !== null && user.lockedUntil > new Date()) {
				return res.status(401).json({ error: "Invalid identifier or password." });
			}

			const passwordValid = await verifyPassword(password, user.passwordHash);

			if (!passwordValid) {
				await userStore.incrementFailedAttempts(user.id);

				if (user.failedLoginAttempts + 1 >= MAX_FAILED_ATTEMPTS) {
					const until = new Date(Date.now() + LOCKOUT_DURATION_MS);
					await userStore.lockAccount(user.id, until);
				}

				return res.status(401).json({ error: "Invalid identifier or password." });
			}

			await userStore.resetFailedAttempts(user.id);

			const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
			const session = await sessionStore.createSession(user.id, expiresAt);

			res.cookie("session_token", session.token, {
				httpOnly: true,
				secure: true,
				sameSite: "strict",
				expires: expiresAt,
			});

			return res.status(200).json({ id: user.id });
		} catch (err) {
			console.error("Signin error:", err);
			return res.status(500).json({ error: "Something went wrong." });
		}
	};
}
