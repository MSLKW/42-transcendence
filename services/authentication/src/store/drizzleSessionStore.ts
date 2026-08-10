import { eq } from "drizzle-orm";
import { sessions } from "@big2/auth-schema";
import { postgres } from "./postgres";
import { Session } from "../models/session";
import { SessionStore } from "./sessionStore";
import { randomBytes } from "crypto";

export class DrizzleSessionStore implements SessionStore {
	async createSession(userId: string, expiresAt: Date): Promise<Session> {
		const token = randomBytes(32).toString("hex");
		const [session] = await postgres.insert(sessions).values({
			token, 
			userId,
			expiresAt,
		}).returning();
		return session;
	}

	async getSession(token: string): Promise<Session | null> {
		const [session] = await postgres.select().from(sessions).where(eq(sessions.token, token));
		return session ?? null;
	}

	async updateExpiry(token: string, expiresAt: Date): Promise<void> {
		await postgres.update(sessions).set({ expiresAt }).where(eq(sessions.token, token));
	}

	async deleteSession(token: string): Promise<void> {
		await postgres.delete(sessions).where(eq(sessions.token, token));
	}

	async deleteSessionsByUserId(userId: string): Promise<void> {
		await postgres.delete(sessions).where(eq(sessions.userId, userId));
	}
}