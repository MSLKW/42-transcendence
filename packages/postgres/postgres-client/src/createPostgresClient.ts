import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { PG_POOL_MAX, PGDATABASE, PGHOST, PGPASSWORD, PGPORT, PGUSER } from "./env";


// 2. Create the single shared connection pool, using password
export const pool = new Pool({
    host:     PGHOST,
    user:     PGUSER,
    database: PGDATABASE,
    password: PGPASSWORD,
    port:     PGPORT,

    // --- Industry Standard Pool Settings ---
    max: PG_POOL_MAX, // Maximum number of clients in the pool (prevents crashing Postgres). PostgreSQL has a default limit of 100 simultaneous connections, controlled by the max_connections parameter
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Return an error if connection takes longer than 2 seconds
  });


// 3. Idle clients can error (e.g. Postgres restarts). 
//    Without a listener Node throws and this service dies. 
//    Log and carry on; the pool replaces the broken client.
pool.on('error', (err) => {
  console.error('Unexpected error on idle Postgres client:', err.message);
});


// 4. Export the postgres client instance
//    Init Drizzle once with the schema
//    postgresql container is the postgres server
//    creating an object to talk to the server is the client, hence the naming of postgresClient
export function createPostgresClient<TSchema extends Record<string, unknown>>(schema: TSchema) {
	return drizzle(pool, { schema });
}

