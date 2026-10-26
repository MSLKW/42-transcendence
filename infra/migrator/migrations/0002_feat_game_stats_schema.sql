CREATE TABLE "game_stats_schema"."player_achievements" (
	"player_id" uuid NOT NULL,
	"achievement" text NOT NULL,
	"unlocked_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "player_achievements_player_id_achievement_pk" PRIMARY KEY("player_id","achievement")
);
--> statement-breakpoint
CREATE TABLE "game_stats_schema"."player_badges" (
	"player_id" uuid NOT NULL,
	"badge" text NOT NULL,
	"unlocked_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "player_badges_player_id_badge_pk" PRIMARY KEY("player_id","badge")
);
--> statement-breakpoint
ALTER TABLE "game_stats_schema"."player_achievements" ADD CONSTRAINT "player_achievements_player_id_player_stats_id_fk" FOREIGN KEY ("player_id") REFERENCES "game_stats_schema"."player_stats"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_stats_schema"."player_badges" ADD CONSTRAINT "player_badges_player_id_player_stats_id_fk" FOREIGN KEY ("player_id") REFERENCES "game_stats_schema"."player_stats"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_stats_schema"."player_stats" DROP COLUMN "total_loss";--> statement-breakpoint
ALTER TABLE "game_stats_schema"."player_stats" ADD CONSTRAINT "level_non_negative" CHECK ("game_stats_schema"."player_stats"."level" >= 0);--> statement-breakpoint
ALTER TABLE "game_stats_schema"."player_stats" ADD CONSTRAINT "xp_non_negative" CHECK ("game_stats_schema"."player_stats"."xp" >= 0);--> statement-breakpoint
ALTER TABLE "game_stats_schema"."player_stats" ADD CONSTRAINT "total_played_non_negative" CHECK ("game_stats_schema"."player_stats"."total_played" >= 0);--> statement-breakpoint
ALTER TABLE "game_stats_schema"."player_stats" ADD CONSTRAINT "total_wins_non_negative" CHECK ("game_stats_schema"."player_stats"."total_wins" >= 0);--> statement-breakpoint
ALTER TABLE "game_stats_schema"."player_stats" ADD CONSTRAINT "win_streak_non_negative" CHECK ("game_stats_schema"."player_stats"."win_streak" >= 0);--> statement-breakpoint
ALTER TABLE "game_stats_schema"."player_stats" ADD CONSTRAINT "wins_not_above_played" CHECK ("game_stats_schema"."player_stats"."total_wins" <= "game_stats_schema"."player_stats"."total_played");--> statement-breakpoint
ALTER TABLE "game_stats_schema"."player_stats" ADD CONSTRAINT "win_streak_not_above_wins" CHECK ("game_stats_schema"."player_stats"."win_streak" <= "game_stats_schema"."player_stats"."total_wins");