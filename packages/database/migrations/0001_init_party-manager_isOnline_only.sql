CREATE SCHEMA "party-manager_schema";
--> statement-breakpoint
CREATE TABLE "party-manager_schema"."player_status" (
	"id" uuid PRIMARY KEY NOT NULL,
	"is_online" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "party-manager_schema"."player_status" ADD CONSTRAINT "player_status_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth_schema"."users"("id") ON DELETE cascade ON UPDATE no action;