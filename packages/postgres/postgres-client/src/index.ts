import fs from 'fs';
import 'dotenv/config'; // Load .env files - When you import dotenv/config, the package executes its config() function immediately as a side effect. This loads the variables from your .env file into process.env automatically.
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";


// 1. Check the environment vars are properly loaded
function requireEnv(name: string): string
{
	const value = process.env[name];
	if (!value)
		throw new Error(`[Error] ${name} not set`);
	return value;
}

function requireEnvNum(name: string): number
{
	const value = Number(requireEnv(name));
	if (!Number.isInteger(value) || value < 0)
		throw new Error(`[Error] ${name} must be a non-negative integer`);
	return value;
}

const PGPASSWORD_FILE = requireEnv("PGPASSWORD_FILE");  // throws if not set or empty in compose
const PGUSER = requireEnv("PGUSER");
const PGPORT = requireEnvNum("PGPORT");
const PGHOST = requireEnv("PGHOST");
const PGDATABASE = requireEnv("PGDATABASE");
const PG_POOL_MAX = requireEnvNum("PG_POOL_MAX");

const PGPASSWORD = fs.readFileSync(PGPASSWORD_FILE, 'utf-8').trim();    // readFileSync throws ENOENT and names the path, if doesn't exist	
if (!PGPASSWORD) 
  throw new Error(`[Error] password file ${PGPASSWORD_FILE} is empty`); // throw if empty or only whitespace


// 2. Create the single shared connection pool, using password
const pool = new Pool({
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


// 3. Export the postgres client instance
//    Init Drizzle once with the schema
//    postgresql container is the postgres server
//    creating an object to talk to the server is the client, hence the naming of postgresClient
export function createPostgresClient<TSchema extends Record<string, unknown>>(schema: TSchema) {
	return drizzle(pool, { schema });
}


// 4. Graceful Shutdown 
//    (This is the industry-standard term for closing connections cleanly before a process exits).
//    You can add this if you find your app "hanging" when you try to stop it:
//    In Dev: It’s convenient so you don't have to restart the Docker container to clear connections.
//    In Production: It is critical. If you restart your backend container without closing the pool, the Postgres server keeps those "dead" connections open until they timeout. If you restart often, you will eventually hit max_connections and your database will stop accepting new requests, crashing your app.
//    conclusion: Gracefully close the database pool when receiving an interruption signal (e.g., Ctrl+C or Docker shutdown)
process.on('SIGINT', async () => {
  await pool.end();
  process.exit(0);
});


console.log(`Database connection pool initialized & database client is created & exported successfully!!`);