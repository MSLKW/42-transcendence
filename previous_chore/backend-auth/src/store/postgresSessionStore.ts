// import { promises as fs } from "fs";
// import path from "path";
// import { randomBytes } from "crypto";
// import { Session } from "../models/session";
// import { SessionStore } from "./sessionStore";
// import { hashToken } from "../auth/hash";
// const DATA_DIR = "./data/sessions";

import { PrismaClient } from "@prisma/client";
import { randomBytes } from "crypto";
import { Session } from "../models/session";
import { SessionStore } from "./sessionStore";
import { hashToken } from "../auth/hash";

// Assuming you export a singleton instance of PrismaClient somewhere
import { prisma } from "../lib/prisma"; 

export class PostgresSessionStore implements SessionStore {
	private prisma: PrismaClient;

	constructor() {
		this.prisma = prisma;
	}

	async createSession(userId: string, expiresAt: Date): Promise<Session> {
		// 1. Generate a secure, unpredictable 32-byte raw token		
		const rawToken = randomBytes(32).toString("hex");

		// 2. Hash it before storing it in the database
		const dbToken = hashToken(rawToken);

		const sessionRecord = await this.prisma.session.create({
			data: {
				token: dbToken,
				userId,
				expiresAt,
			},
		});

		return {
			token: rawToken,
			userId: sessionRecord.userId,
			createdAt: sessionRecord.createdAt,
			expiresAt: sessionRecord.expiresAt,
		};
		// const token = randomBytes(32).toString("hex");

		// const stored = {
		// 	userId,
		// 	createdAt: new Date(),
		// 	expiresAt,
		// };

		// await this.writeSessionFile(token, stored);
		// return { token, ...stored };
	}

	async getSession(rawToken: string): Promise<Session | null> {
		const dbToken = hashToken(rawToken);

		const sessionRecord = await this.prisma.session.findUnique({
			where: { token: dbToken },
		});

		if (!sessionRecord)
			return null;

		if (new Date() > sessionRecord.expiresAt) {
			await this.deleteSession(rawToken);
			return null;
		}

		return {
			token: rawToken,
			userId: sessionRecord.userId,
			createdAt: sessionRecord.createdAt,
			expiresAt: sessionRecord.expiresAt,
		};
		// 	return this.readSessionFile(token);
	}

	async updateExpiry(rawToken: string, expiresAt: Date): Promise<void> {
		const dbToken = hashToken(rawToken);

		try {
			await this.prisma.session.update({
				where: { token: dbToken },
				data: { expiresAt },
			});
		} catch (error: any) {
			if (error.code === "P2025")
				throw new Error("SESSION_NOT_FOUND");
			throw error;
		}
		// const session = await this.readSessionFile(token);
		// if (session === null) {
		// 	throw new Error("SESSION_NOT_FOUND");
		// }
		// await this.writeSessionFile(token, {
		// 	userId: session.userId,
		// 	createdAt: session.createdAt,
		// 	expiresAt,
		// });
	}

	async deleteSession(rawToken: string): Promise<void> {
		const dbToken = hashToken(rawToken);

		try {
			await this.prisma.session.delete({
				where: { token: dbToken },
			});
		} catch (error: any) {
			if (error.code == "P2025")
				throw error;
		}
		// try {
		// 	await fs.unlink(this.filePath(token));
		// } catch (err: any) {
		// 	if (err.code !== "ENOENT") {
		// 		throw err;
		// 	}
		// }
	}
	
	async deleteSessionsByUserId(userId: string): Promise<void> {
		await this.prisma.session.deleteMany({
			where: { userId },
		});
		// const all = await this.readAllSessionFiles();
		// const matching = all.filter(s => s.userId === userId);

		// for (const session of matching) {
		// 	await fs.unlink(path.join(DATA_DIR, `${session.fileToken}.json`));
		// }
	}
}


