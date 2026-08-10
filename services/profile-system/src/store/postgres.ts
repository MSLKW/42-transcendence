import { createDbClient } from "@big2/db-client";
import * as profileSystemSchema from "@big2/profile-system-schema";

export const postgres = createDbClient(profileSystemSchema);