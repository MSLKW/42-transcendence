CREATE SCHEMA "auth_schema";
--> statement-breakpoint
CREATE SCHEMA "party_manager_schema";
--> statement-breakpoint
CREATE SCHEMA "profile_system_schema";
--> statement-breakpoint
CREATE SCHEMA "game_schema";
--> statement-breakpoint
CREATE TABLE "auth_schema"."sessions" (
	"token" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "auth_schema"."users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"username" text,
	"password_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"failed_login_attempts" integer DEFAULT 0 NOT NULL,
	"locked_until" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "party_manager_schema"."player_status" (
	"id" uuid PRIMARY KEY NOT NULL,
	"is_online" boolean DEFAULT false NOT NULL,
	"is_in_game" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile_system_schema"."user_data" (
	"id" uuid PRIMARY KEY NOT NULL,
	"username" text,
	"avatar_path" text,
	"badge" text DEFAULT 'Newcomer' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
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
CREATE TABLE "game_schema"."player_stats" (
	"id" uuid PRIMARY KEY NOT NULL,
	"level" integer DEFAULT 0 NOT NULL,
	"xp" integer DEFAULT 0 NOT NULL,
	"total_played" integer DEFAULT 0 NOT NULL,
	"total_wins" integer DEFAULT 0 NOT NULL,
	"total_loss" integer DEFAULT 0 NOT NULL,
	"win_streak" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "auth_schema"."sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_schema"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "party_manager_schema"."player_status" ADD CONSTRAINT "player_status_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth_schema"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_system_schema"."user_data" ADD CONSTRAINT "user_data_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth_schema"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_system_schema"."user_settings" ADD CONSTRAINT "user_settings_id_user_data_id_fk" FOREIGN KEY ("id") REFERENCES "profile_system_schema"."user_data"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_schema"."player_stats" ADD CONSTRAINT "player_stats_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth_schema"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "sessions_expires_at_idx" ON "auth_schema"."sessions" USING btree ("expires_at");