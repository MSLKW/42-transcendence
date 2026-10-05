ALTER TABLE "party_schema"."player_status" ADD COLUMN "last_online" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "party_schema"."player_status" DROP COLUMN "is_online";--> statement-breakpoint
ALTER TABLE "party_schema"."player_status" DROP COLUMN "is_in_game";