import { eq, sql } from "drizzle-orm";
import { users } from "@big2/auth-schema";
import { postgresClient } from "./postgresClient";
import { User } from "../models/user";
import { UserStore } from "./userStore";

export class DrizzleUserStore implements UserStore {
	async createUser(email: string, passwordHash: string): Promise<User> {
		try
		{
			const [user] = await postgresClient
				.insert(users)
				.values({ email, passwordHash })
				.returning();
			return user;
		}
		catch (error: any)
		{
			if (error.code === "23505") //Postgres's unique_violation
				throw new Error("DUPLICATE_EMAIL");
			console.error("Failed to createUser in database", error);			
			throw error;
		}
	}

	async getUserById(id: string): Promise<User | null> {
		const [user] = await postgresClient
			.select()
			.from(users)
			.where(eq(users.id, id));
		return user ?? null;
	}

	async getUserByEmail(email: string): Promise<User | null> {
		const [user] = await postgresClient
			.select()
			.from(users)
			.where(eq(users.email, email));
		return user ?? null;
	}

	async getUserByUsername(username: string): Promise<User | null> {
		const [user] = await postgresClient
			.select()
			.from(users)
			.where(eq(users.username, username));
		return user ?? null;
	}

	async setUsername(id: string, username: string): Promise<void> {
		await postgresClient
			.update(users)
			.set({ username })
			.where(eq(users.id, id));
	}

	async incrementFailedAttempts(id: string): Promise<void> {
		// avoid race conditions: This requires using sql increments, in 1 query.
		const result = await postgresClient
			.update(users)
			// .set({failedLoginAttempts: user.failedLoginAttempts + 1})
			.set({ //Atomic = 1 query instead of 2
				failedLoginAttempts: sql`${users.failedLoginAttempts} + 1`,
			})
			.where(eq(users.id, id));

		if (result.rowCount === 0)
			throw new Error("USER_NOT_FOUND");
	}

	async resetFailedAttempts(id: string): Promise<void> {
		await postgresClient
			.update(users)
			.set({ failedLoginAttempts: 0 })
			.where(eq(users.id, id));
	}

	async lockAccount(id: string, until: Date): Promise<void> {
		await postgresClient
			.update(users)
			.set({ lockedUntil: until })
			.where(eq(users.id, id));
	}
}