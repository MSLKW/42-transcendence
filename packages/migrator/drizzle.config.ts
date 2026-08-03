/// <reference types="node" />
import fs from "fs";
import 'dotenv/config'; // 1. Load .env files
import { defineConfig } from "drizzle-kit";


// 2. Helper to safely read the password
function dbPassword() {
  // a: Check for Docker secret file first
  if (process.env.DB_PASSWORD_FILE && fs.existsSync(process.env.DB_PASSWORD_FILE)) {
    console.log(`Using Docker secrets: ${process.env.DB_PASSWORD_FILE}`);
    return fs.readFileSync(process.env.DB_PASSWORD_FILE, "utf8").trim();
  }
  // b: Fallback for local development
  if (process.env.DUMMY_POSTGRES_PASSWORD) {
    console.log(`Using env's Dummy DB Password:  ${process.env.DUMMY_POSTGRES_PASSWORD}`);
    return process.env.DUMMY_POSTGRES_PASSWORD || "";
  }

  return "aisyahDatabaseGirlFinallyy!333>u<";
};

const password = dbPassword(); // <-- Call the function here!
if (!password) {
  throw new Error("CRITICAL: Database password could not be loaded.");
}


// 3. Define the main guidance of how Drizzle do its work
// 		defineConfig function = acts as the central control center for Drizzle Kit (your migration tool)
// 		"configuration schema" that tells Drizzle exactly how to talk to your database and where to find your code.
export default defineConfig({
    dialect: "postgresql",  // cannot use env vars and has nothing to do with .env
    schema: "./src/schema/index.schema.ts", // points to the "Source of Truth." => the schema/index.ts file pointing to all other schemas
    out: "./migrations", // naming is following industry standard / drizzle kit's default behaviour / drizzle's documentation
    dbCredentials: {
        // Construct the URL using the helper
        url: `${process.env.DB_HOST}://${process.env.DB_USER}:${password}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    },
    // Optional: Add verbose logging for debugging migrations
    verbose: true, // Makes the terminal output talkative. It will show you the exact SQL strings it's running. This is vital when you are learning or debugging why a migration might be failing.
    strict: true,  // safety feature. In strict mode, Drizzle is more aggressive about ensuring your TypeScript schema matches your database exactly. If there are extra tables in your DB that aren't in your schema, it might warn you or complain, helping you keep your database "clean."
});


