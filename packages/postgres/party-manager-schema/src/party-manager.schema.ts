import { pgSchema, boolean, uuid, timestamp } from "drizzle-orm/pg-core"; // pg-core specificly means postgres
import { users } from "@big2/auth-schema";


export const partyManagerSchema = pgSchema("party_manager_schema");

export const playerStatus = partyManagerSchema.table("player_status", {
	id: uuid("id")
		.primaryKey()
		.references(() => users.id, { onDelete: "cascade" }),
	isOnline: boolean("is_online")
		.default(false)
		.notNull(),
	isInGame: boolean("is_in_game")
		.default(false)
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});
