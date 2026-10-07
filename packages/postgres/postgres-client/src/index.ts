import fs from 'fs';
import 'dotenv/config'; // loads .env into process.env as a side effect of importing
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
const PGUSER          = requireEnv("PGUSER");
const PGPORT          = requireEnvNum("PGPORT");
const PGHOST          = requireEnv("PGHOST");
const PGDATABASE      = requireEnv("PGDATABASE");
const PG_POOL_MAX     = requireEnvNum("PG_POOL_MAX");

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


// 5. Closes the pool. Each service calls this from its own shutdown handler.
//    Safe to call twice: pool.end() throws if called twice, so the Promise is stored and reused.
let closing: Promise<void> | undefined;

export function closePostgresClientPool(): Promise<void>
{
  // closing ??= pool.end(); same syntax meaning as 2 lines below
  if (closing === undefined)
    closing = pool.end();
  return closing;

}


// 7. Recognise "Postgres is down / restarting / unreachable" errors, 
//    so services can answer 503 (retry later) instead of 500 (bug). 
const DB_DOWN_CODES = new Set([
  'ECONNREFUSED', 'ECONNRESET', 'ETIMEDOUT',  // network-level failures (nothing listening, connection dropped, timed out)
  'ENOTFOUND', 'EAI_AGAIN',                   // postgresql stopped, Docker's DNS can't find the container
  '57P01', '57P03',                           // Postgres's err codes for "shutting down" and "starting up, not ready"
  '08000', '08001', '08003', '08006',         // Postgres's "connection exception" family
]);


// regex test
// i === ignore upper/lower case
// The text between the slashes is the pattern
// checks whether the error message contains that phrase.
// needed coz when the pool can't get a connection within the 2-second connectionTimeoutMillis, pg throws a plain error with that message and no code.
export function isDbDown(err: any): boolean {
  const e = err?.cause ?? err;                // newer Drizzle wraps the original pg error in .cause
  return DB_DOWN_CODES.has(e?.code) 
    || /connection terminated|timeout exceeded when trying to connect/i.test(e?.message ?? '');   
}


console.log(`Database connection pool initialized & database client is created & exported successfully!!`);