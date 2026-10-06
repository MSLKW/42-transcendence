import fs from 'fs';
import 'dotenv/config'; // Load .env files - When you import dotenv/config, the package executes its config() function immediately as a side effect. This loads the variables from your .env file into process.env automatically.
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";


// 1. Check the environment vars are properly loaded
const PGPASSWORD = fs.readFileSync(process.env.PGPASSWORD_FILE!, 'utf-8').trim();
if (!PGPASSWORD)
  throw new Error("CRITICAL: Database password could not be loaded from the secret file itself.");

export const PGUSER = process.env.PGUSER;
export const PGPORT = process.env.PGPORT;
export const PGHOST = process.env.PGHOST;
export const PGDATABASE = process.env.PGDATABASE;
export const PG_POOL_MAX = process.env.PG_POOL_MAX;

if (!PGUSER)      throw new Error("[Error] PGUSER not set");
if (!PGPORT)      throw new Error("[Error] PGPORT not set");
if (!PGHOST)      throw new Error("[Error] PGHOST not set");
if (!PGDATABASE)  throw new Error("[Error] PGDATABASE not set");
if (!PG_POOL_MAX) throw new Error("[Error] PG_POOL_MAX not set");


// 2. Create the single shared connection pool, using password
const pool = new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    database: process.env.PGDATABASE,
    password: PGPASSWORD,
    port: Number(process.env.PGPORT), // syntax: env var, fallback value if forgot to put in .env, parse into decimal number 

    // --- Industry Standard Pool Settings ---
    max: Number(process.env.PG_POOL_MAX), // Maximum number of clients in the pool (prevents crashing Postgres). PostgreSQL has a default limit of 100 simultaneous connections, controlled by the max_connections parameter
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Return an error if connection takes longer than 2 seconds
  });


// 3. Export the db client instance
//    Init Drizzle once with the schema
// export const postgres = drizzle(pool, { schema }); // this is in full definition how other services going to use this function
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