CREATE SCHEMA "auth_schema";
--> statement-breakpoint
CREATE SCHEMA "party_manager_schema";
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
	"player_id" uuid PRIMARY KEY NOT NULL,
	"is_online" boolean DEFAULT false NOT NULL,
	"is_in_game" boolean DEFAULT false NOT NULL,
	"is_in_party" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "game_schema"."player_stats" (
	"player_id" uuid PRIMARY KEY NOT NULL,
	"level" integer DEFAULT 0 NOT NULL,
	"xp" integer DEFAULT 0 NOT NULL,
	"total_played" integer DEFAULT 0 NOT NULL,
	"total_wins" integer DEFAULT 0 NOT NULL,
	"total_loss" integer DEFAULT 0 NOT NULL,
	"win_streak" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "player_stats_player_id_unique" UNIQUE("player_id")
);
--> statement-breakpoint
ALTER TABLE "auth_schema"."sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_schema"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "party_manager_schema"."player_status" ADD CONSTRAINT "player_status_player_id_users_id_fk" FOREIGN KEY ("player_id") REFERENCES "auth_schema"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_schema"."player_stats" ADD CONSTRAINT "player_stats_player_id_users_id_fk" FOREIGN KEY ("player_id") REFERENCES "auth_schema"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "sessions_expires_at_idx" ON "auth_schema"."sessions" USING btree ("expires_at");