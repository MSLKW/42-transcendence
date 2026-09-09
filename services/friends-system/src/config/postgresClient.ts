import { createPostgresClient } from "@big2/postgres-client";
import * as friendsSystemSchema from "@big2/friends-system-schema";

export const postgresClient = createPostgresClient(friendsSystemSchema);