// import { promises as fs } from "fs";
// import path from "path";
// import { randomUUID } from "crypto";
// const DATA_DIR = "./data/users";

import { PrismaClient, User as PrismaUser } from '@prisma/client';
import { User } from "../models/user";
import { UserStore } from "./userStore";

// Assuming you export your instantiated client from a global file
import { prisma } from "../lib/prisma"; 

export class PostgresUserStore implements UserStore {
	// constructor(private prisma: PrismaClient) {}

    private prisma: PrismaClient;

    constructor() {
        this.prisma = prisma;
    }
	
	async createUser(email: string, passwordHash: string): Promise<User> {
		try {
			const user = await this.prisma.user.create({
				data: {
					email,
					passwordHash,
				},
			});
			return user as User;
		} catch (error: any) {
			if (error.code === "P2002" && error.meta?.target?.includes("email")) {
				throw new Error("DUPLICATE_EMAIL");
			}
			throw error;
		}
		// const existing = await this.getUserByEmail(email);
		// if (existing !== null) {
		// 	throw new Error("DUPLICATE_EMAIL");
		// }

		// const user: User = {
		// 	id: randomUUID(),
		// 	email,
		// 	username: null,
		// 	passwordHash,
		// 	createdAt: new Date(),
		// 	failedLoginAttempts: 0,
		// 	lockedUntil: null,
		// };

		// await this.writeUserFile(user);
		// return user;
	}

	async getUserById(id: string): Promise<User | null> {
		const user = await this.prisma.user.findUnique({
			where: { id },
		});
		return user as User | null;
		// return this.readUserFile(id);
	}

	async getUserByEmail(email: string): Promise<User | null> {
		const user = await this.prisma.user.findUnique({
			where: { email },
		});
		return user as User | null;
		// const users = await this.readAllUsers();
		// return users.find(u => u.email === email) ?? null;
	}

	async getUserByUsername(username: string): Promise<User | null> {
		const user = await this.prisma.user.findUnique({
			where: { username },
		});
		return user as User | null;
		// const users = await this.readAllUsers();
		// return users.find(u => u.username === username) ?? null;
	}

	async setUsername(id: string, username: string): Promise<void> {
		try {
			await this.prisma.user.update({
				where: { id },
				data: { username },
			});
		} catch (error: any) {
				// Prisma error codes: 
					// Record not found (P2025) 
					// Unique constraint failed (P2002)
			if (error.code === "P2025") {			
				throw new Error("USER_NOT_FOUND");
			}
			if (error.code === "P2002" && error.meta?.target?.includes("username")) {
				throw new Error("DUPLICATE_USERNAME");
			}
			throw error;
		}
		// const user = await this.readUserFile(id);
		// if (user === null) {
		// 	throw new Error("USER_NOT_FOUND");
		// }
		// const existing = await this.getUserByUsername(username);
		// if (existing !== null) {
		// 	throw new Error("DUPLICATE_USERNAME");
		// }
		// user.username = username;
		// await this.writeUserFile(user);
	}

	async incrementFailedAttempts(id: string): Promise<void> {
		try {
			await this.prisma.user.update({
				where: { id },
				data: {
					failedLoginAttempts: {
						increment: 1, // Atomic database increment
					},
				},
			});
		} catch (error: any) {
			if (error.code === "P2025") throw new Error("USER_NOT_FOUND");
			throw error;
		}
		// const user = await this.readUserFile(id);
		// if (user === null) {
		// 	throw new Error("USER_NOT_FOUND");
		// }
		// user.failedLoginAttempts += 1;
		// await this.writeUserFile(user);
	}

	async resetFailedAttempts(id: string): Promise<void> {
		try {
			await this.prisma.user.update({
				where: { id },
				data: { failedLoginAttempts: 0 },
			});
		} catch (error: any) {
			if (error.code === "P2026") throw new Error("USER_NOT_FOUND");
			throw error;
		}
		// const user = await this.readUserFile(id);
		// if (user === null) {
		// 	throw new Error("USER_NOT_FOUND");
		// }
		// user.failedLoginAttempts = 0;
		// await this.writeUserFile(user);
	}

	async lockAccount(id: string, until: Date): Promise<void> {
		try {
			await this.prisma.user.update({
				where: { id },
				data: { lockedUntil: until },
			});
		} catch (error: any) {
			if (error.code === "P2025") 
				throw new Error("USER_NOT_FOUND");
			throw error;
		}
	// 	const user = await this.readUserFile(id);
	// 	if (user === null) {
	// 		throw new Error("USER_NOT_FOUND");
	// 	}
	// 	user.lockedUntil = until;
	// 	await this.writeUserFile(user);
	}
}
