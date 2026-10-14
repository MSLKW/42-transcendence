import { pgSchema, uuid, unique, integer, timestamp, index, check } from "drizzle-orm/pg-core";
// import { sql } from "drizzle-orm"; => use later on postgres-18-bookworm
import { users } from "@big2/auth-schema";


export const gameStatsSchema = pgSchema("game_stats_schema");


export const player = gameStatsSchema.table("player_stats", {
	id: uuid("id")
		.primaryKey()
		.references(() => users.id, { onDelete: "cascade" }),
	level: integer("level")
		.default(0)
		.notNull(),
	xp: integer("xp")
		.default(0)
		.notNull(),
	totalPlayed: integer("total_played")
		.default(0)
		.notNull(),
	totalWins: integer("total_wins")
		.default(0)
		.notNull(),
	totalLoss: integer("total_loss")
		.default(0)
		.notNull(),
	winStreak: integer("win_streak")
		.default(0)
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
}
// for learning purpose , i keep her for now. might be useful for game_schema
// , (table) => [
// 	index("player_stats_xp_idx").on(table.xp),
// 	check("xp_non_negative", sql`${table.xp} >= 0`),
// 	check("level_non_negative", sql`${table.level} >= 0`),
// ]
);