import { promises as fs } from "fs";
import path from "path";
import { Session } from "../models/session";
import { SessionStore } from "./sessionStore";

const DATA_DIR = "./data/sessions";

export class FileSessionStore implements SessionStore
{
	private filePath(filename: string)
	{
		return (path.join(DATA_DIR, `${filename}.json`));
	}

	private async readSessionFile(tokenHash: string): Promise<Session | null>
	{
		try
		{
			const raw = await fs.readFile(this.filePath(tokenHash), "utf-8");
			const parsed = JSON.parse(raw);
			return {
				tokenHash:	tokenHash,
				userId:		parsed.userId,
				createdAt:	new Date(parsed.createdAt),
				expiresAt:	new Date(parsed.expiresAt),
			};
		}
		catch (err: any)
		{
			if (err.code === "ENOENT")
				return null;
			throw err;
		}
	}

	private async readAllSessionFiles(): Promise<Session[]>
	{
		await fs.mkdir(DATA_DIR, { recursive: true });
		const files = await fs.readdir(DATA_DIR);
		const sessions: Session[] = [];

		for (const file of files)
		{
			const raw = await fs.readFile(path.join(DATA_DIR, file), "utf-8");
			const parsed = JSON.parse(raw);
			sessions.push({
				tokenHash:	file.replace(/\.json$/, ""),
				userId:		parsed.userId,
				createdAt:	new Date(parsed.createdAt),
				expiresAt:	new Date(parsed.expiresAt),
			});
		}

		return sessions;
	}

	private async writeSessionFile(session: Session): Promise<void>
	{
		await fs.mkdir(DATA_DIR, { recursive: true });
		await fs.writeFile(this.filePath(session.tokenHash), JSON.stringify(session, null, 2));
	}

	async createSession(session: Session): Promise<void>
	{
		await this.writeSessionFile(session);
	}

	
	async getSession(tokenHash: string): Promise<Session | null>
	{
		return this.readSessionFile(tokenHash);
	}

	async updateExpiry(tokenHash: string, expiresAt: Date): Promise<void>
	{
		const session = await this.readSessionFile(tokenHash);
		if (session === null)
			throw new Error("SESSION_NOT_FOUND");

		await this.writeSessionFile({
			tokenHash:	tokenHash,
			userId:		session.userId,
			createdAt:	session.createdAt,
			expiresAt:	expiresAt
		});
	}

	async deleteSession(tokenHash: string): Promise<void>
	{
		try
		{
			await fs.unlink(this.filePath(tokenHash));
		}
		catch (err: any)
		{
			if (err.code !== "ENOENT") {
				throw err;
			}
		}
	}

	async deleteSessionsByUserId(userId: string): Promise<void>
	{
		const all = await this.readAllSessionFiles();
		const matching = all.filter(s => s.userId === userId);

		for (const session of matching)
		{
			await fs.unlink(this.filePath(session.tokenHash));
		}
	}

	async deleteExpired(): Promise<void>
	{
		const sessions = await this.readAllSessionFiles();
		const now = new Date;

		for (const session of sessions)
		{
			if (session.expiresAt < now)
				await fs.unlink(this.filePath(session.tokenHash));
		}
	}
}
