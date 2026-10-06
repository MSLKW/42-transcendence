import { createPostgresClient } from "@big2/postgres-client";
import * as gameStatsSchema from "@big2/game-stats-schema";

export const postgresClient = createPostgresClient(gameStatsSchema);