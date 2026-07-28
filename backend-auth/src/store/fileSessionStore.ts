import { promises as fs } from "fs";
import path from "path";
import { randomBytes } from "crypto";
import { Session } from "../models/session";
import { SessionStore } from "./sessionStore";
import { hashToken } from "../auth/hash";

const DATA_DIR = "./data/sessions";

export class FileSessionStore implements SessionStore {
	private filePath(token: string): string {
		return path.join(DATA_DIR, `${hashToken(token)}.json`);
	}

	private async readSessionFile(token: string): Promise<Session | null> {
		try {
			const raw = await fs.readFile(this.filePath(token), "utf-8");
			const parsed = JSON.parse(raw);
			return {
				token, // the raw token the caller already has; never read from disk
				userId: parsed.userId,
				createdAt: new Date(parsed.createdAt),
				expiresAt: new Date(parsed.expiresAt),
			};
		} catch (err: any) {
			if (err.code === "ENOENT") {
				return null;
			}
			throw err;
		}
	}

	private async writeSessionFile(token: string, session: Omit<Session, "token">): Promise<void> {
		await fs.mkdir(DATA_DIR, { recursive: true });
		await fs.writeFile(this.filePath(token), JSON.stringify(session, null, 2));
	}

	async createSession(userId: string, expiresAt: Date): Promise<Session> {
		const token = randomBytes(32).toString("hex");

		const stored = {
			userId,
			createdAt: new Date(),
			expiresAt,
		};

		await this.writeSessionFile(token, stored);
		return { token, ...stored };
	}

	private async readAllSessionFiles(): Promise<Array<Omit<Session, "token"> & { fileToken: string }>> {
		await fs.mkdir(DATA_DIR, { recursive: true });
		const files = await fs.readdir(DATA_DIR);
		const sessions: Array<Omit<Session, "token"> & { fileToken: string }> = [];

		for (const file of files) {
			const raw = await fs.readFile(path.join(DATA_DIR, file), "utf-8");
			const parsed = JSON.parse(raw);
			sessions.push({
				fileToken: file.replace(/\.json$/, ""), // the hashed token, used only to locate the file
				userId: parsed.userId,
				createdAt: new Date(parsed.createdAt),
				expiresAt: new Date(parsed.expiresAt),
			});
		}

		return sessions;
	}

	async getSession(token: string): Promise<Session | null> {
		return this.readSessionFile(token);
	}

	async updateExpiry(token: string, expiresAt: Date): Promise<void> {
		const session = await this.readSessionFile(token);
		if (session === null) {
			throw new Error("SESSION_NOT_FOUND");
		}
		await this.writeSessionFile(token, {
			userId: session.userId,
			createdAt: session.createdAt,
			expiresAt,
		});
	}

	async deleteSession(token: string): Promise<void> {
		try {
			await fs.unlink(this.filePath(token));
		} catch (err: any) {
			if (err.code !== "ENOENT") {
				throw err;
			}
		}
	}

	async deleteSessionsByUserId(userId: string): Promise<void> {
		const all = await this.readAllSessionFiles();
		const matching = all.filter(s => s.userId === userId);

		for (const session of matching) {
			await fs.unlink(path.join(DATA_DIR, `${session.fileToken}.json`));
		}
	}
}
