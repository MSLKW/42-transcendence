import fs from 'fs';
import 'dotenv/config'; // 1. Load .env files // When you import dotenv/config, the package executes its config() function immediately as a side effect. This loads the variables from your .env file into process.env automatically.
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema/index.schema"

// 2. Helper to safely read the password
function dbPassword() {
  // a: Docker path - If the _FILE path is provided, read the secret from the file
  if (process.env.DB_PASSWORD_FILE && fs.existsSync(process.env.DB_PASSWORD_FILE)) {
    console.log(`Database's index.ts => using Docker secrets: ${process.env.DB_PASSWORD_FILE}`);
    return fs.readFileSync(process.env.DB_PASSWORD_FILE, 'utf8').trim();
  }

  // b: Fallback -> local development path
    console.log(`Database's index.ts => using env's Dummy DB Password: ${process.env.DUMMY_POSTGRES_PASSWORD}`);
    return process.env.DUMMY_POSTGRES_PASSWORD || "";
};

const password = dbPassword();
if (!password) {
  throw new Error("CRITICAL: Database password could not be loaded.");
}


// 3. Create the single shared connection pool, using password
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: password,
    port: parseInt(process.env.DB_PORT || "5432", 10), // syntax: env var, fallback value if forgot to put in .env, parse into decimal number 

    // --- Industry Standard Pool Settings ---
    max: parseInt(process.env.POSTGRES_MAX_CONNECTIONS || "20", 10), // Maximum number of clients in the pool (prevents crashing Postgres). PostgreSQL has a default limit of 100 simultaneous connections, controlled by the max_connections parameter
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Return an error if connection takes longer than 2 seconds
  });


// Export the db client instance
//    Init Drizzle once with the full schema bundle
export const postgres = drizzle(pool, { schema });

// Re-export everything (all schemas from schema/index.ts)
//    So microservices can use table definitions (like `users`, `sessions`)
export * from "./schema/index.schema";


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



console.log(`~~~ Database connection pool initialized & Drizzle ORM'S instance exported successfully ~~~`);