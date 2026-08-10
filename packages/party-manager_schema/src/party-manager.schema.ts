// create schema: party-manager_schema
// create table: player_status
// have 3 bools:
// - is_online (default: no)
// - is_in_party (default: no) - not yet
// - is_in_game (default: no) - not yet
// need uuid to be relational

import { pgSchema, boolean, uuid } from "drizzle-orm/pg-core"; // pg-core specificly means postgres
// import { serial, integer } from "drizzle-orm/pg-core"; 
import { users } from "@big2/auth_schema";

export const partyManagerSchema = pgSchema("party-manager_schema");

export const playerStatus = partyManagerSchema.table("player_status", {
	id: uuid("id")
		.primaryKey()
		.references(() => users.id, {onDelete: "cascade" }),
	isOnline: boolean("is_online").default(false).notNull(), // default => offline
	// isInGame: boolean("is_in_game").default(false).notNull(),
	// isInParty: boolean("is_in_party").default(false).notNull(),
	// partyManagersId: integer("party_managers_id")
	// 	.references(() => partyManagers.id, {onDelete: "cascade" }),
});

// export const partyManagers = partyManagerSchema.table("party_managers", {
// 	id: serial("id").primaryKey(),
// });

