CREATE TABLE "game_stats_schema"."processed_rounds" (
	"round_id" uuid PRIMARY KEY NOT NULL,
	"processed_at" timestamp with time zone DEFAULT now() NOT NULL
);
