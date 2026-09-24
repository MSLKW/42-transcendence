import { Request, response, Response } from "express";
import { User } from "../models/user";
import { UserStore } from "../store/userStore";
import { Session } from "../models/session";
import { SessionStore } from "../store/sessionStore";
import { verifyPassword, hashToken } from "../auth/hash";
import { validateEmail } from "../auth/validation";
import { SESSION_DURATION_MS } from "../config/sessionConfig";
import { randomBytes } from "crypto";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const PROFILE_SERVICE_URL = process.env.PROFILE_SERVICE_URL;

if (!PROFILE_SERVICE_URL)
	console.warn("[Warning] PROFILE_SERVICE_URL not set. Logins with username will not work");

export function signinHandler(userStore: UserStore, sessionStore: SessionStore)
{
	return async (req: Request, res: Response) =>
	{
		if (req.headers["content-type"] != "application/json")
			return res.status(415).json(
				{ error: "Content-Type must be application/json" }
			);
		
		const { identifier, password } = req.body ?? {};
		if (typeof identifier !== "string" || typeof password !== "string")
			return res.status(400).json({ error: "Identifier and password are required." });

		try
		{
			let user = validateEmail(identifier)
				? await userStore.getUserByEmail(identifier)
				: null;

			if (user == null && PROFILE_SERVICE_URL && !validateEmail(identifier))
			{
				try
				{
					const profileRes = await fetch(`${PROFILE_SERVICE_URL}/search-exact/${identifier}`);
					if (!profileRes.ok)
						user = null;
					else
					{
						const data = await profileRes.json();
						user = await userStore.getUserById(data.uuid);
						if (user)
						{
							try
							{
								await userStore.setUsername(user.id, identifier)
							}
							catch (err)
							{
								return res.status(500).json({ error: "Something went wrong." });
							}
						}
					}
				}
				catch (err)
				{	
					console.warn("[Warning] profile system could not be reached:", err);
					console.warn("[Warning] trying internally stored username");
					user = await userStore.getUserByUsername(identifier);

					if (!user)
						return res.status(500).json({ error: "Username not found. Try signing in with email instead" })					
				}
			}
				
			if (await attemptLogin(user, password, userStore))
				return loginSuccess(user!, userStore, sessionStore, res);
			else
				return res.status(401).json({ error: "Invalid identifier or password." });
		}
		catch (err)
		{
			console.error("Signin error:", err);
			return res.status(500).json({ error: "Something went wrong." });
		}
	};
}

async function attemptLogin(user: User | null, password: string, userStore: UserStore)
{
	if (user === null)
		return false;

	if (user.lockedUntil !== null && user.lockedUntil > new Date())
		return false;

	const passwordValid = await verifyPassword(password, user.passwordHash);

	if (!passwordValid)
	{
		await userStore.incrementFailedAttempts(user.id);

		if (user.failedLoginAttempts + 1 >= MAX_FAILED_ATTEMPTS) //  cant it take from the updated count what sql did? 
		{
			const until = new Date(Date.now() + LOCKOUT_DURATION_MS);
			await userStore.lockAccount(user.id, until);
		}
		return false;
	}
	return true;
}

async function loginSuccess(user: User, userStore: UserStore, sessionStore: SessionStore, res: Response)
{
	await userStore.resetFailedAttempts(user.id);
	await sessionStore.deleteSessionsByUserId(user.id);

	const sessionToken = randomBytes(32).toString("hex");
	const session: Session = {
		tokenHash:	hashToken(sessionToken),
		userId:		user.id,
		createdAt:	new Date(),
		expiresAt:	new Date(Date.now() + SESSION_DURATION_MS)
	}
	await sessionStore.createSession(session);

	res.cookie("session_token", sessionToken, {
		httpOnly: true,
		secure: true,
		sameSite: "strict",
		expires: session.expiresAt,
	});
	return res.status(200).json({ id: user.id });
}