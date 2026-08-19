import { users } from "@big2/auth-schema";
import { pgSchema, uuid } from "drizzle-orm/pg-core";

export const friendsSystemSchema = pgSchema("friends_system_schema");

export const connections = friendsSystemSchema.table("connections", {
	id: uuid("user_id")
		.unique()
		.primaryKey()
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
})

export const inbox = friendsSystemSchema.table("inbox", {
	id: uuid("user_id")
		.unique()
		.primaryKey()
		.notNull()
		.references(() => connections.id, { onDelete: "cascade" }),
})