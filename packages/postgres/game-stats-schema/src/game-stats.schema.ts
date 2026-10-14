import { sql } from "drizzle-orm";
import { users } from "@big2/auth-schema";
import type { AchievementLabel, BadgeLabel } from "@big2/game-stats-types";
import { pgSchema, uuid, text, integer, timestamp, check, primaryKey } from "drizzle-orm/pg-core";

export const gameStatsSchema = pgSchema("game_stats_schema");

export const playerStats = gameStatsSchema.table("player_stats", {
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
	winStreak: integer("win_streak")
		.default(0)
		.notNull(),
	displayedBadge: text("displayed_badge")
		.$type<BadgeLabel>()
		.default("Newcomer")
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	}
	, (table) => [
		check("level_non_negative", sql`${table.level} >= 0`),
		check("xp_non_negative", sql`${table.xp} >= 0`),
		check("total_played_non_negative", sql`${table.totalPlayed} >= 0`),
		check("total_wins_non_negative", sql`${table.totalWins} >= 0`),
		check("win_streak_non_negative", sql`${table.winStreak} >= 0`),
		check("wins_not_above_played", sql`${table.totalWins} <= ${table.totalPlayed}`),
		check("win_streak_not_above_wins", sql`${table.winStreak} <= ${table.totalWins}`),
	]
);

export const playerAchievements = gameStatsSchema.table("player_achievements", {
	playerId: uuid("player_id")
		.notNull()
		.references(() => playerStats.id, { onDelete: "cascade" }),
	achievement: text("achievement")
		.$type<AchievementLabel>()
		.notNull(),
	unlockedAt: timestamp("unlocked_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
}, (table) => [
	primaryKey({ columns: [table.playerId, table.achievement] }),
]);

export const playerBadges = gameStatsSchema.table("player_badges", {
	playerId: uuid("player_id")
		.notNull()
		.references(() => playerStats.id, { onDelete: "cascade" }),
	badge: text("badge")
		.$type<BadgeLabel>()
		.notNull(),
	unlockedAt: timestamp("unlocked_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
}, (table) => [
	primaryKey({ columns: [table.playerId, table.badge] })
]);
