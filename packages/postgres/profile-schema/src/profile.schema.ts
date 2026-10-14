import { users } from "@big2/auth-schema";
import { type BadgeLabel } from "@big2/profile-types";
import { pgSchema, uuid, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";


export const profileSchema = pgSchema("profile_schema");

export const userData = profileSchema.table("user_data", {
	// owned by auth
	id: uuid("id")
		.primaryKey()
		.references(() => users.id, { onDelete: "cascade" }),
		
	// owned by profile ( yeay! )
	username: text("username")
		.unique(),
	avatarPath: text("avatar_path"),
	badge: text("badge") // TODO: will need to fix this later after game-stats is done. (profile: handles what is on display, game-stats: handles what is unlocked)
		.$type<BadgeLabel>()
		.default("Newcomer")
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});


export const userSettings = profileSchema.table("user_settings", {
	id: uuid("id")
		.primaryKey()
		.references(() => userData.id, { onDelete: "cascade" }),
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
