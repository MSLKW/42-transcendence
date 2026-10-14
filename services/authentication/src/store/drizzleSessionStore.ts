import { eq, lte } from "drizzle-orm";
import { sessions } from "@big2/auth-schema";
import { postgresClient } from "../config/postgresClient";
import { Session } from "../models/session";
import { SessionStore } from "./sessionStore";

export class DrizzleSessionStore implements SessionStore {

	// sessions = authschema table's name
	// Session = model's name
	// session = parameter name
	async createSession(session: Session): Promise<void> {
		await postgresClient
			.insert(sessions)
			.values({ 
				tokenHash: session.tokenHash, 
				userId: session.userId, 
				createdAt: session.createdAt, 
				expiresAt: session.expiresAt, 
			})
			.onConflictDoUpdate({
				target: sessions.userId,
				set: { 
					tokenHash: session.tokenHash, 
					expiresAt: session.expiresAt, 
				},
			});
	}

	async getSession(tokenHash: string): Promise<Session | null> {
		const [session] = await postgresClient
			.select()
			.from(sessions)
			.where(eq(sessions.tokenHash, tokenHash));
		return session ?? null;
	}

	async updateExpiry(tokenHash: string, expiresAt: Date): Promise<void> {
		await postgresClient
			.update(sessions)
			.set({ expiresAt })
			.where(eq(sessions.tokenHash, tokenHash));
	}

	async deleteSession(tokenHash: string): Promise<void> {
		await postgresClient
			.delete(sessions)
			.where(eq(sessions.tokenHash, tokenHash));
	}

	async deleteSessionsByUserId(userId: string): Promise<void> {
		await postgresClient
			.delete(sessions)
			.where(eq(sessions.userId, userId));
	}

	// Date() = now since epoch in miliseconds
	// have to give Date object(new Date()) 
	// which Drizze serializes properly to compare against to timestamp, 
	// instead a string (Date()) that inst usable
	async deleteExpired(): Promise<void> {
		await postgresClient
			.delete(sessions)
			.where(lte(sessions.expiresAt, new Date())); 
	}

}