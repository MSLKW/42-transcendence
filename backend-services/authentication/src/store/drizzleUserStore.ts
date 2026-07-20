import { eq } from "drizzle-orm";
import { users } from "@big2/database"; 	// the database package
import { postgres } from "./postgres"; 				// the drizzle database connection instance
import { User } from "../models/user";
import { UserStore } from "./userStore";

export class DrizzleUserStore implements UserStore {
	async createUser(email: string, passwordHash: string): Promise<User> {
		const [user] = await postgres.insert(users).values({ email, passwordHash }).returning();
		return user;
	}

	async getUserById(id: string): Promise<User | null> {
		const [user] = await postgres.select().from(users).where(eq(users.id, id));
		return user ?? null;
	}

	async getUserByEmail(email: string): Promise<User | null> {
		const [user] = await postgres.select().from(users).where(eq(users.email, email));
		return user ?? null;
	}

	async getUserByUsername(username: string): Promise<User | null> {
		const [user] = await postgres.select().from(users).where(eq(users.username, username));
		return user ?? null;
	}

	async setUsername(id: string, username: string): Promise<void> {
		await postgres.update(users).set({ username }).where(eq(users.id, id));
	}

	async incrementFailedAttempts(id: string): Promise<void> {
		// Note: This requires getting current value or using sql increments
		const user = await this.getUserById(id);
		if (!user)
			throw new Error("USER_NOT_FOUND");
		await postgres.update(users)
			.set({failedLoginAttempts: user.failedLoginAttempts + 1})
			.where(eq(users.id, id));
	}

	async resetFailedAttempts(id: string): Promise<void> {
		await postgres.update(users)
			.set({ failedLoginAttempts: 0 })
			.where(eq(users.id, id));
	}

	async lockAccount(id: string, until: Date): Promise<void> {
		await postgres.update(users)
			.set({ lockedUntil: until })
			.where(eq(users.id, id));
	}
}