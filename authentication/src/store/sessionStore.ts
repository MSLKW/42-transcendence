import { Session } from "../models/session";

export interface SessionStore {
	createSession(userId: string, expiresAt: Date): Promise<Session>;
	getSession(token: string): Promise<Session | null>;
	updateExpiry(token: string, expiresAt: Date): Promise<void>;
	deleteSession(token: string): Promise<void>;
	deleteSessionsByUserId(userId: string): Promise<void>;
	deleteExpired(): Promise<void>;
}
