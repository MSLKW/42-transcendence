CREATE SCHEMA "auth_schema";
--> statement-breakpoint
CREATE SCHEMA "party_manager_schema";
--> statement-breakpoint
CREATE SCHEMA "friends_system_schema";
--> statement-breakpoint
CREATE SCHEMA "game_schema";
--> statement-breakpoint
CREATE SCHEMA "profile_system_schema";
--> statement-breakpoint
CREATE TYPE "friends_system_schema"."friend_request_status_enum" AS ENUM('Pending', 'Accepted', 'Rejected');--> statement-breakpoint
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
CREATE TABLE "friends_system_schema"."friend_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sender_id" uuid NOT NULL,
	"receiver_id" uuid NOT NULL,
	"friend_request_status" "friends_system_schema"."friend_request_status_enum" DEFAULT 'Pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"pair_small_id" uuid GENERATED ALWAYS AS (LEAST(sender_id, receiver_id)) STORED,
	"pair_big_id" uuid GENERATED ALWAYS AS (GREATEST(sender_id, receiver_id)) STORED,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "friends_system_schema"."friendships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"friend_small_id" uuid NOT NULL,
	"friend_big_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ordered_friends_pair_check" CHECK ("friends_system_schema"."friendships"."friend_small_id" < "friends_system_schema"."friendships"."friend_big_id")
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
ALTER TABLE "auth_schema"."sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_schema"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "party_manager_schema"."player_status" ADD CONSTRAINT "player_status_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth_schema"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friends_system_schema"."friend_requests" ADD CONSTRAINT "friend_requests_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "auth_schema"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friends_system_schema"."friend_requests" ADD CONSTRAINT "friend_requests_receiver_id_users_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "auth_schema"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friends_system_schema"."friendships" ADD CONSTRAINT "friendships_friend_small_id_users_id_fk" FOREIGN KEY ("friend_small_id") REFERENCES "auth_schema"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friends_system_schema"."friendships" ADD CONSTRAINT "friendships_friend_big_id_users_id_fk" FOREIGN KEY ("friend_big_id") REFERENCES "auth_schema"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_schema"."player_stats" ADD CONSTRAINT "player_stats_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth_schema"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_system_schema"."user_data" ADD CONSTRAINT "user_data_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth_schema"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_system_schema"."user_settings" ADD CONSTRAINT "user_settings_id_user_data_id_fk" FOREIGN KEY ("id") REFERENCES "profile_system_schema"."user_data"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "sessions_expires_at_idx" ON "auth_schema"."sessions" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "sender_receiver_idx" ON "friends_system_schema"."friend_requests" USING btree ("sender_id","receiver_id");--> statement-breakpoint
CREATE UNIQUE INDEX "pending_pair_unique_idx" ON "friends_system_schema"."friend_requests" USING btree ("pair_small_id","pair_big_id") WHERE "friends_system_schema"."friend_requests"."friend_request_status" = 'Pending';--> statement-breakpoint
CREATE UNIQUE INDEX "friends_pair_unique_idx" ON "friends_system_schema"."friendships" USING btree ("friend_small_id","friend_big_id");