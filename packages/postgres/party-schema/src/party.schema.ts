import { pgSchema, boolean, uuid, timestamp } from "drizzle-orm/pg-core"; // pg-core specificly means postgres
import { users } from "@big2/auth-schema";


export const partySchema = pgSchema("party_schema");

export const playerStatus = partySchema.table("player_status", {
	id: uuid("id")
		.primaryKey()
		.references(() => users.id, { onDelete: "cascade" }),
	lastOnline: timestamp("last_online", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});
