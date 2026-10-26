import { closePostgresClientPool } from "@big2/postgres-client";

export async function closeDb()
{
	await closePostgresClientPool();
}
