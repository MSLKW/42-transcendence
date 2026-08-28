CREATE SCHEMA "profile_system_schema";
--> statement-breakpoint
CREATE TABLE "profile_system_schema"."user_data" (
	"id" uuid PRIMARY KEY NOT NULL,
	"username" text,
	"avatar_path" text,
	"badge" text DEFAULT 'Newcomer' NOT NULL,
	"achievements" jsonb DEFAULT '{"FIRST_LOGIN":null,"LOGIN_1_WEEK":null,"PLAYED_1_GAME":null,"PLAYED_10_GAMES":null,"PLAYED_42_GAMES":null,"FIRST_WIN":null,"WIN_STREAK_2":null,"WIN_STREAK_5":null,"WIN_STREAK_10":null,"MASTER_COLLECTOR":null}'::jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_data_id_unique" UNIQUE("id"),
	CONSTRAINT "user_data_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "profile_system_schema"."user_settings" (
	"id" uuid PRIMARY KEY NOT NULL,
	"allow_3_of_a_kind" boolean DEFAULT false NOT NULL,
	"allow_2_of_spades_end" boolean DEFAULT false NOT NULL,
	"auto_pass_index" integer DEFAULT 0 NOT NULL,
	"end_game_condition" integer DEFAULT 0 NOT NULL,
	"score_calculation" integer DEFAULT 0 NOT NULL,
	"card_style" integer DEFAULT 0 NOT NULL,
	"ui_color" integer DEFAULT 0 NOT NULL,
	"fx_level" integer DEFAULT 0 NOT NULL,
	"mx_level" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profile_system_schema"."user_data" ADD CONSTRAINT "user_data_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth_schema"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_system_schema"."user_settings" ADD CONSTRAINT "user_settings_id_user_data_id_fk" FOREIGN KEY ("id") REFERENCES "profile_system_schema"."user_data"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE VIEW "profile_system_schema"."user_profile" AS (select "profile_system_schema"."user_data"."id", "profile_system_schema"."user_data"."username", "profile_system_schema"."user_data"."avatar_path", "profile_system_schema"."user_data"."badge", "profile_system_schema"."user_data"."achievements", "profile_system_schema"."user_settings"."allow_3_of_a_kind", "profile_system_schema"."user_settings"."allow_2_of_spades_end", "profile_system_schema"."user_settings"."auto_pass_index", "profile_system_schema"."user_settings"."end_game_condition", "profile_system_schema"."user_settings"."score_calculation", "profile_system_schema"."user_settings"."card_style", "profile_system_schema"."user_settings"."ui_color", "profile_system_schema"."user_settings"."fx_level", "profile_system_schema"."user_settings"."mx_level" from "profile_system_schema"."user_data" left join "profile_system_schema"."user_settings" on "profile_system_schema"."user_data"."id" = "profile_system_schema"."user_settings"."id");