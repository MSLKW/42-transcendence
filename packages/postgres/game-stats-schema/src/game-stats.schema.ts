import { sql } from "drizzle-orm";
import { users } from "@big2/auth-schema";
import { type AchievementLabel, type BadgeLabel, BADGE_LABELS, ACHIEVEMENT_LABELS } from "@big2/game-stats-types";
import { pgSchema, uuid, text, integer, timestamp, check, primaryKey } from "drizzle-orm/pg-core";
import { sqlList } from "./utils";


export const gameStatsSchema = pgSchema("game_stats_schema");

export const playerStats = gameStatsSchema.table("player_stats", {
	playerUuid: uuid("id")
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
		check("valid_displayed_badge", sql`${table.displayedBadge} IN (${sqlList(BADGE_LABELS)})`),
	]
);

export const playerAchievements = gameStatsSchema.table("player_achievements", {
	playerId: uuid("player_id")
		.notNull()
		.references(() => playerStats.playerUuid, { onDelete: "cascade" }),
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
	check("valid_achievements", sql`${table.achievement} IN (${sqlList(ACHIEVEMENT_LABELS)})`),
]);

export const playerBadges = gameStatsSchema.table("player_badges", {
	playerId: uuid("player_id")
		.notNull()
		.references(() => playerStats.playerUuid, { onDelete: "cascade" }),
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
	primaryKey({ columns: [table.playerId, table.badge] }),
	check("valid_badges", sql`${table.badge} IN (${sqlList(BADGE_LABELS)})`),
]);

export const processedRounds = gameStatsSchema.table("processed_rounds", {
	roundId: uuid("round_id")
		.primaryKey(),
	processedAt: timestamp("processed_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});
