CREATE SCHEMA "friends_system_schema";
--> statement-breakpoint
CREATE TYPE "friends_system_schema"."friend_request_status_enum" AS ENUM('Pending', 'Accepted', 'Rejected');--> statement-breakpoint
CREATE TABLE "friends_system_schema"."friend_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sender_id" uuid NOT NULL,
	"receiver_id" uuid NOT NULL,
	"friend_request_status" "friends_system_schema"."friend_request_status_enum" DEFAULT 'Pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
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
ALTER TABLE "friends_system_schema"."friend_requests" ADD CONSTRAINT "friend_requests_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "auth_schema"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friends_system_schema"."friend_requests" ADD CONSTRAINT "friend_requests_receiver_id_users_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "auth_schema"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friends_system_schema"."friendships" ADD CONSTRAINT "friendships_friend_small_id_users_id_fk" FOREIGN KEY ("friend_small_id") REFERENCES "auth_schema"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friends_system_schema"."friendships" ADD CONSTRAINT "friendships_friend_big_id_users_id_fk" FOREIGN KEY ("friend_big_id") REFERENCES "auth_schema"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "sender_receiver_idx" ON "friends_system_schema"."friend_requests" USING btree ("sender_id","receiver_id");--> statement-breakpoint
CREATE UNIQUE INDEX "friends_pair_unique_idx" ON "friends_system_schema"."friendships" USING btree ("friend_small_id","friend_big_id");