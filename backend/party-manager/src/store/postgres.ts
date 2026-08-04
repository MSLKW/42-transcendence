import * as partyManagerSchema from "@big2/party-manager_schema";
import { createDbClient } from "@big2/db-client";

export const postgres = createDbClient(partyManagerSchema);