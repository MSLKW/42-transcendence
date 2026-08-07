import { createDbClient } from "@big2/db-client";
import * as profileSystemSchema from "@big2/profile-system_schema";

export const postgres = createDbClient(profileSystemSchema);