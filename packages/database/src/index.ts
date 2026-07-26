import fs from 'fs';
import 'dotenv/config'; // When you import dotenv/config, the package executes its config() function immediately as a side effect. This loads the variables from your .env file into process.env automatically.
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema/index"

// 1. Helper to safely read the password
function dbPassword() {
  // a: Docker path - If the _FILE path is provided, read the secret from the file
  if (process.env.DB_PASSWORD_FILE && fs.existsSync(process.env.DB_PASSWORD_FILE)) {
    console.log(`Database's index.ts => using Docker secrets: ${process.env.DB_PASSWORD_FILE}`);
    return fs.readFileSync(process.env.DB_PASSWORD_FILE, 'utf8').trim();
  }

  // b: Fallback -> local development path
    console.log(`Database's index.ts => using env's Dummy DB Password: ${process.env.DUMMY_DB_PASSWORD}`);
    return process.env.DUMMY_DB_PASSWORD || "";
};

const password = dbPassword();
if (!password) {
  throw new Error("CRITICAL: Database password could not be loaded.");
}


// 2. Create the single shared connection pool, using password
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: password,
    port: parseInt(process.env.DB_PORT || "5432", 10)
});


// Export the db client instance
//    Init Drizzle once with the full schema bundle
export const postgres = drizzle(pool, { schema });

// Re-export everything (all schemas from schema/index.ts)
//    So microservices can use table definitions (like `users`, `sessions`)
export * from "./schema/index";


// 4. Graceful Shutdown 
//    (This is the industry-standard term for closing connections cleanly before a process exits).
//    You can add this if you find your app "hanging" when you try to stop it:
//    In Dev: It’s convenient so you don't have to restart the Docker container to clear connections.
//    In Production: It is critical. If you restart your backend container without closing the pool, the Postgres server keeps those "dead" connections open until they timeout. If you restart often, you will eventually hit max_connections and your database will stop accepting new requests, crashing your app.
process.on('SIGINT', async () => {
  await pool.end();
  process.exit(0);
});



console.log(`~~~Yeayyy done setup orm-drizzle~~~`);