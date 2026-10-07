import { createPostgresClient } from "@big2/postgres-client";
import * as profileSchema from "@big2/profile-schema";

export const postgresClient = createPostgresClient(profileSchema);