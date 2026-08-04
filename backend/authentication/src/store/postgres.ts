import { createDbClient } from "@big2/db-client";
import * as auth_schema from "@big2/auth_schema";

export const postgres = createDbClient(auth_schema);