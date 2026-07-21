import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { User } from "../models/user";
import { UserStore } from "./userStore";

const DATA_DIR = "./data/users";

export class FileUserStore implements UserStore {
	private filePath(id: string): string {
		return path.join(DATA_DIR, `${id}.json`);
	}

	private async readUserFile(id: string): Promise<User | null> {
		try {
			const raw = await fs.readFile(this.filePath(id), "utf-8");
			return JSON.parse(raw) as User;
		} catch (err: any) {
			if (err.code === "ENOENT") {
				return null;
			}
			throw err;
		}
	}

	private async writeUserFile(user: User): Promise<void> {
		await fs.mkdir(DATA_DIR, { recursive: true });
		await fs.writeFile(this.filePath(user.id), JSON.stringify(user, null, 2));
	}

	private async readAllUsers(): Promise<User[]> {
		await fs.mkdir(DATA_DIR, { recursive: true });
		const files = await fs.readdir(DATA_DIR);
		const users: User[] = [];
		for (const file of files) {
			const raw = await fs.readFile(path.join(DATA_DIR, file), "utf-8");
			users.push(JSON.parse(raw) as User);
		}
		return users;
	}

	async createUser(email: string, passwordHash: string): Promise<User> {
		const existing = await this.getUserByEmail(email);
		if (existing !== null) {
			throw new Error("DUPLICATE_EMAIL");
		}

		const user: User = {
			id: randomUUID(),
			email,
			username: null,
			passwordHash,
			createdAt: new Date(),
			failedLoginAttempts: 0,
			lockedUntil: null,
		};

		await this.writeUserFile(user);
		return user;
	}

	async getUserById(id: string): Promise<User | null> {
		return this.readUserFile(id);
	}

	async getUserByEmail(email: string): Promise<User | null> {
		const users = await this.readAllUsers();
		return users.find(u => u.email === email) ?? null;
	}

	async getUserByUsername(username: string): Promise<User | null> {
		const users = await this.readAllUsers();
		return users.find(u => u.username === username) ?? null;
	}

	async setUsername(id: string, username: string): Promise<void> {
		const user = await this.readUserFile(id);
		if (user === null) {
			throw new Error("USER_NOT_FOUND");
		}
		const existing = await this.getUserByUsername(username);
		if (existing !== null) {
			throw new Error("DUPLICATE_USERNAME");
		}
		user.username = username;
		await this.writeUserFile(user);
	}

	async incrementFailedAttempts(id: string): Promise<void> {
		const user = await this.readUserFile(id);
		if (user === null) {
			throw new Error("USER_NOT_FOUND");
		}
		user.failedLoginAttempts += 1;
		await this.writeUserFile(user);
	}

	async resetFailedAttempts(id: string): Promise<void> {
		const user = await this.readUserFile(id);
		if (user === null) {
			throw new Error("USER_NOT_FOUND");
		}
		user.failedLoginAttempts = 0;
		await this.writeUserFile(user);
	}

	async lockAccount(id: string, until: Date): Promise<void> {
		const user = await this.readUserFile(id);
		if (user === null) {
			throw new Error("USER_NOT_FOUND");
		}
		user.lockedUntil = until;
		await this.writeUserFile(user);
	}
}
