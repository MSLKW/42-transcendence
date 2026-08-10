import { pgSchema, uuid, text, integer, date, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { authSchema } from "@big2/auth-schema";
import { partyManagerSchema } from "@big2/party-manager-schema";
import { UserSettings, BadgeLabel, AchievementLabel } from "../../../../services/profile-system/src/types";

export const profileSystemSchema = pgSchema("profile-system_schema");

// enums
// export const userSettingsEnum = profileSystemSchema.enum("user_settings_enum", 
// 	[ 
// 		"autoPassKey",
// 		"allow3OfAKind",
// 		"allow2OfSpadesEnd",
// 		"autoPassIndex",
// 		"endGameCondition",
// 		"scoreCalculation",
// 		"cardStyle",
// 		"uiColor",
// 		"fxLevel",
// 		"mxLevel"
// 	]
// );

// export const autoPassKeysEnum = profileSystemSchema.enum("auto_pass_keys_enum",
// 	[
// 		"1s",
// 		"3s",
// 		"5s",
// 		"10s",
// 		"15s",
// 		"30s",
// 		"42s",
// 		"1 min",
// 		"2 mins",
// 		"No Limit"
// 	]
// );

// export const badgeLabelEnum = profileSystemSchema.enum("badge_label_enum",
// 	[
// 		"Newcomer",
// 		"Beginner's Luck",
// 		"Challenger",
// 		"Enthusiast",
// 		"Risk Taker",
// 		"The Strategist",
// 		"Big 2 Champion"
// 	]
// );

// export const achievementLabelEnum = profileSystemSchema.enum("achievement_label_enum",
// 	[
// 		"FIRST_LOGIN",
// 		"LOGIN_1_WEEK",
// 		"PLAYED_1_GAME",
// 		"PLAYED_10_GAMES",
// 		"PLAYED_42_GAMES",
// 		"FIRST_WIN",
// 		"WIN_STREAK_2",
// 		"WIN_STREAK_5",
// 		"WIN_STREAK_10",
// 		"MASTER_COLLECTOR"
// 	]
// );

export const userData = profileSystemSchema.table("user_data", {
	username: text("username")
		.primaryKey(),
	uuid: uuid("uuid")
		.notNull()
		.unique()
		.references(() => authSchema.users.id, { onDelete: "cascade" }),
	avatarPath: text("avatar_path"),
	userSettings: jsonb("user_settings")
		.notNull()
		.$type<UserSettings>()
		.default({}),
	badge: jsonb("badge")
		.notNull()
		.$type<BadgeLabel>()
		.default("NewComer"),
	achievements: jsonb("achievements").$type<Record<AchievementLabel, Date>>()
		.notNull()
		.$type<AchievementLabel>()
		.default("FIRST_LOGIN"),
	level: integer("level")
		.notNull()
		.default(0),
	xp: integer("xp")
		.notNull()
		.default(0),
	createdAt: timestamp("created_at")
		.notNull()
		.defaultNow()
		.references(() => authSchema.users.createdAt, { onDelete: "cascade"}),
	lastLogin: timestamp("last_login")
		.notNull(),
	totalPlayed: integer("total_played")
		.notNull()
		.default(0),
	totalWins: integer("total_wins")
		.notNull()
		.default(0),
	totalLoss: integer("total_loss")
		.notNull()
		.default(0),
	winStreak: integer("win_streak")
		.notNull()
		.default(0),
});