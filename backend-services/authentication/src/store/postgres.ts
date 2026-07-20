import fs from 'fs';
import 'dotenv/config'; // When you import dotenv/config, the package executes its config() function immediately as a side effect. This loads the variables from your .env file into process.env automatically.
import { Pool } from 'pg';
import * as authSchema from '@big2/database'; // alias maps "@big2/database" to "../../packages/database/drizzle/src/schema/auth.schema.ts" (tsconfig.json)
import { drizzle } from 'drizzle-orm/node-postgres';

// 1. Load .env files
// 		drizzle-kit does not automatically load your .env files unless you tell it to
// 		Using (import 'dotenv/config';) is the standard way to fix this.
//    If you write both import 'dotenv/config' and dotenv.config() in the same file, it will just run the configuration process twice. 
//    Won't break your app, but unnecessary and redundant.


// 2. Helper to safely read the password
function dbPassword() {
  // a: Docker path - If the _FILE path is provided, read the secret from the file
  if (process.env.DB_PASSWORD_FILE && fs.existsSync(process.env.DB_PASSWORD_FILE)) {
    console.log(`Using Docker secrets: ${process.env.DB_PASSWORD_FILE}`);
    return fs.readFileSync(process.env.DB_PASSWORD_FILE, 'utf8').trim();
  }

  // b: Fallback -> local development path
    console.log(`Using env's Dummy DB Password: ${process.env.DUMMY_DB_PASSWORD}`);
    return process.env.DUMMY_DB_PASSWORD || "";
};


// 3. Create the Pool
const password = dbPassword(); // <-- Call the function here!

if (!password) {
  throw new Error("CRITICAL: Database password could not be loaded.");
}

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: password, // <-- Now this is a string
    port: parseInt(process.env.DB_PORT || "5432", 10)
});


// 4. Database Client / Database Connection Engine / Drizzle Client Initialization
// Drizzle creates the Drizzle object, but it needs an engine!
//    Drizzle creates the Drizzle object, but it needs an engine!
//    The 'pool' is the engine provided by 'pg'.
//    Using new Pool() is the industry standard for production Node.js applications. 
//    Safest way to ensure your auth service remains responsive and stable under load.
export const postgres = drizzle(pool, {schema: authSchema });


// 5. Graceful Shutdown 
//    (This is the industry-standard term for closing connections cleanly before a process exits).
//    You can add this if you find your app "hanging" when you try to stop it:
//    In Dev: It’s convenient so you don't have to restart the Docker container to clear connections.
//    In Production: It is critical. If you restart your backend container without closing the pool, the Postgres server keeps those "dead" connections open until they timeout. If you restart often, you will eventually hit max_connections and your database will stop accepting new requests, crashing your app.
process.on('SIGINT', async () => {
  await pool.end();
  process.exit(0);
});