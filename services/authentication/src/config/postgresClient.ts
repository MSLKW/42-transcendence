import { createPostgresClient } from "@big2/postgres-client";
import * as authSchema from "@big2/auth-schema";

export const postgresClient = createPostgresClient(authSchema);