import { eq } from "drizzle-orm";
import { sessions } from "@big2/database";
import { db } from "../db/db";
import { Session } from "../models/session";
import { SessionStore } from "./sessionStore";
import { randomBytes } from "crypto";

export class DrizzleSessionStore implements SessionStore {
	async createSession(userId: string, expiresAt: Date): Promise<Session> {
		const token = randomBytes(32).toString("hex");
		const [session] = await db.insert(sessions).values({
			token, 
			userId,
			expiresAt,
		}).returning();
		return session;
	}

	async getSession(token: string): Promise<Session | null> {
		const [session] = await db.select().from(sessions).where(eq(sessions.token, token));
		return session ?? null;
	}

	async updateExpiry(token: string, expiresAt: Date): Promise<void> {
		await db.update(sessions).set({ expiresAt }).where(eq(sessions.token, token));
	}

	async deleteSession(token: string): Promise<void> {
		await db.delete(sessions).where(eq(sessions.token, token));
	}

	async deleteSessionsByUserId(userId: string): Promise<void> {
		await db.delete(sessions).where(eq(sessions.userId, userId));
	}
}