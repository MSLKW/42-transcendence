import { createPostgresClient } from "@big2/postgres-client";
import * as friendsSchema from "@big2/friends-schema";

export const postgresClient = createPostgresClient(friendsSchema);