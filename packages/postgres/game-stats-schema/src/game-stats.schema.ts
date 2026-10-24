import { sql } from "drizzle-orm";
import { users } from "@big2/auth-schema";
import { 
	type AchievementId, 
	type BadgeId, 
	BADGE_IDS, 
	ACHIEVEMENT_IDS, 
	type GameEndStatsResponse 
} from "@big2/game-stats-types";
import { pgSchema, uuid, text, integer, timestamp, check, primaryKey, jsonb } from "drizzle-orm/pg-core";
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
	displayedBadgeId: text("displayed_badge")
		.$type<BadgeId>()
		.default("fresh_deal")
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
		check("valid_displayed_badge", sql`${table.displayedBadgeId} IN (${sqlList(BADGE_IDS)})`),
	]
);

export const playerAchievements = gameStatsSchema.table("player_achievements", {
	playerUuid: uuid("player_id")
		.notNull()
		.references(() => playerStats.playerUuid, { onDelete: "cascade" }),
	achievementId: text("achievement")
		.$type<AchievementId>()
		.notNull(),
	unlockedAt: timestamp("unlocked_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
}, (table) => [
	primaryKey({ columns: [table.playerUuid, table.achievementId] }),
	check("valid_achievements", sql`${table.achievementId} IN (${sqlList(ACHIEVEMENT_IDS)})`),
]);

export const playerBadges = gameStatsSchema.table("player_badges", {
	playerUuid: uuid("player_id")
		.notNull()
		.references(() => playerStats.playerUuid, { onDelete: "cascade" }),
	badgeId: text("badge")
		.$type<BadgeId>()
		.notNull(),
	unlockedAt: timestamp("unlocked_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
}, (table) => [
	primaryKey({ columns: [table.playerUuid, table.badgeId] }),
	check("valid_badges", sql`${table.badgeId} IN (${sqlList(BADGE_IDS)})`),
]);

// responseBody is nullable - only coz the row is inserted first 
// and the body is saved at the end of the same transaction. 
// After commit it is always filled. 
export const processedRounds = gameStatsSchema.table("processed_rounds", {
	roundId: uuid("round_id")
		.primaryKey(),
	responseBody: jsonb("response_body")
		.$type<GameEndStatsResponse>(),
	processedAt: timestamp("processed_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});
