import { users } from "@big2/auth-schema";
import { AutoPassKeys, BadgeLabel, AchievementLabel } from "@big2/profile-system-types";
import { pgSchema, uuid, text, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";


export const profileSystemSchema = pgSchema("profile_system_schema");


export const userData = profileSystemSchema.table("user_data", {
	// owned by auth
	id: uuid("id")
		.primaryKey()
		.unique()
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
		
	// owned by profile-system ( yeay! )
	username: text("username").unique(),
	avatarPath: text("avatar_path"),
	badge: jsonb("badge")
		.$type<BadgeLabel>()
		.default("Newcomer")
		.notNull(),
	achievements: jsonb("achievements")
		.$type<Record<AchievementLabel, Date>>()
		.default({})
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});


export const userSettings = profileSystemSchema.table("user_settings", {
	id: uuid("id")
		.primaryKey()
		.notNull()
		.references(() => userData.id, { onDelete: "cascade" }),
	autoPassKey: 		jsonb("auto_pass_key").$type<AutoPassKeys>().default("10s").notNull(),
	allow3OfAKind: 		boolean("allow_3_of_a_kind").default(false).notNull(),
	allow2OfSpadesEnd: 	boolean("allow_2_of_spades_end").default(false).notNull(),
	autoPassIndex: 		integer("auto_pass_index").default(0).notNull(),
	endGameCondition: 	integer("end_game_condition").default(0).notNull(),
	scoreCalculation: 	integer("score_calculation").default(0).notNull(),
	cardStyle: 			integer("card_style").default(0).notNull(),
	uiColor: 			integer("ui_color").default(0).notNull(),
	fxLevel: 			integer("fx_level").default(0).notNull(),
	mxLevel: 			integer("mx_level").default(0).notNull(),
	updatedAt: 			timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// qb stands for Query Builder.
// qb = a helper object passed into callback functions that gives you access to Drizzle's SQL-building methods (like .select(), .from(), .where(), and .fullJoin()).
// qb = a dedicated toolset provided by Drizzle to build a SQL query step-by-step before executing or saving it.
// Scope Isolation: when defining a view via .as((qb) => ...), Drizzle provides a fresh qb instance HTto keep the view's internal query logic contained and independent from your main database instance (postgres).
export const userProfile = profileSystemSchema.view("user_profile").as((qb) => 
  qb
    .select({
      id: 					userData.id,
      username: 			userData.username,
      avatarPath: 			userData.avatarPath,
      badge: 				userData.badge,
      achievements: 		userData.achievements,
      autoPassKey: 			userSettings.autoPassKey,
      allow3OfAKind: 		userSettings.allow3OfAKind,
      allow2OfSpadesEnd:	userSettings.allow2OfSpadesEnd,
      autoPassIndex: 		userSettings.autoPassIndex,
      endGameCondition: 	userSettings.endGameCondition,
      scoreCalculation: 	userSettings.scoreCalculation,
      cardStyle: 			userSettings.cardStyle,
      uiColor: 				userSettings.uiColor,
      fxLevel: 				userSettings.fxLevel,
      mxLevel: 				userSettings.mxLevel,
    })
    .from(userData) 		// <--- THIS IS THE LEFT TABLE (The Anchor) => userData's id is empty? userProfile's row ignored that id
    .leftJoin(userSettings, // <--- THIS IS THE RIGHT TABLE
		eq(userData.id, userSettings.id))
);
/
// LEFT JOIN (Anchor-based): Treats userData as the source of truth. Every user in userData is guaranteed to appear in the view. If they don't have settings yet, setting fields become null, but id: userData.id is always guaranteed to be a valid UUID.
// FULL JOIN (Symmetrical): Includes rows even if userData is missing but userSettings exists. In that orphaned scenario, userData.id does not exist in Postgres, so your view output maps id: userData.id as null.


// userFullProfile 
// > reserved naming in drizzle syntax
// for the whole complete profile details as per types.ts of profile-system-types
// combined with other API responses to achieve full profile as per mentioned type.ts
