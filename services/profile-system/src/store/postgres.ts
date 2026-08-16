import { createPostgresClient } from "@big2/postgres-client";
import * as profileSystemSchema from "@big2/profile-system-schema";

export const postgres = createPostgresClient(profileSystemSchema);