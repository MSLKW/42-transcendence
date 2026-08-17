import * as partyManagerSchema from "@big2/party-manager-schema";
import { createPostgresClient } from "@big2/postgres-client";

export const postgres = createPostgresClient(partyManagerSchema);