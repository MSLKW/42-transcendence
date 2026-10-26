import { Session } from "../models/session";

export interface SessionStore {
	createSession(session: Session): Promise<void>;
	getSession(tokenHash: string): Promise<Session | null>;
	updateExpiry(tokenHash: string, expiresAt: Date): Promise<void>;
	deleteSession(tokenHash: string): Promise<void>;
	deleteSessionsByUserId(userId: string): Promise<void>;
	deleteExpired(): Promise<void>;
}
