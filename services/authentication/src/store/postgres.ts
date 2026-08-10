import { createDbClient } from "@big2/db-client";
import * as authSchema from "@big2/auth-schema";

export const postgres = createDbClient(authSchema);