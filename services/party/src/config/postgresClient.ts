import * as partySchema from "@big2/party-schema";
import { createPostgresClient } from "@big2/postgres-client";

export const postgresClient = createPostgresClient(partySchema);