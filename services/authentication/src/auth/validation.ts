import { SessionStore } from "../store/sessionStore";
import { Session } from "../models/session";
import { SESSION_DURATION_MS } from "../config/sessionConfig";
import { hashToken } from "./hash";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
const MIN_USERNAME_LENGTH = 3;

export function validateEmail(email: string): boolean {
	return EMAIL_REGEX.test(email);
}

export function validatePassword(password: string): { valid: boolean; reason?: string } {
	if (password.length < MIN_PASSWORD_LENGTH) {
		return {
			valid: false,
			reason: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`
		};
	}
	return { valid: true };
}

export function validateUsername(username: string): { valid: boolean; reason?: string} {
	if (username.length < MIN_USERNAME_LENGTH) {
		return {
			valid: false,
			reason: `Username must be at least ${MIN_USERNAME_LENGTH} characters long`
		};
	}
	return { valid: true };
}

export async function validateSession(sessionStore: SessionStore, token: string): Promise<Session | null>
{
	const tokenHash = hashToken(token);
	const session = await sessionStore.getSession(tokenHash);

	if (session === null)
		return null;

	const now = new Date();
	if (session.expiresAt < now)
	{
		await sessionStore.deleteSession(tokenHash);
		return null;
	}

	const newExpiresAt = new Date(now.getTime() + SESSION_DURATION_MS);
	await sessionStore.updateExpiry(tokenHash, newExpiresAt);

	return { ...session, expiresAt: newExpiresAt };
}
