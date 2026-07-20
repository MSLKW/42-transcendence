import fs from "fs";
import 'dotenv/config'; 
import { defineConfig } from "drizzle-kit";


// 1. Load .env files
// 		drizzle-kit does not automatically load your .env files unless you tell it to
// 		Using (import 'dotenv/config';) is the standard way to fix this.


// 2. Helper to safely read the password
// const getDbPassword = () => {
function dbPassword() {
  if (process.env.DB_PASSWORD_FILE && fs.existsSync(process.env.DB_PASSWORD_FILE)) {
    console.log(`Using Docker secrets: ${process.env.DB_PASSWORD_FILE}`);
    return fs.readFileSync(process.env.DB_PASSWORD_FILE, "utf8").trim();
  }
  // Fallback for local development
    console.log(`Using env's Dummy DB Password:  ${process.env.DUMMY_DB_PASSWORD}`);
    return process.env.DUMMY_DB_PASSWORD || "";
};

const password = dbPassword(); // <-- Call the function here!

if (!password) {
  throw new Error("CRITICAL: Database password could not be loaded.");
}


// 3. Define the main guidance of how Drizzle do its work
// 		defineConfig function = acts as the central control center for Drizzle Kit (your migration tool)
// 		"configuration schema" that tells Drizzle exactly how to talk to your database and where to find your code.
export default defineConfig({
    dialect: "postgresql",
    schema: "./drizzle/src/schema/index.schema.ts", // points to the "Source of Truth." => the main schema file pointing to all other schemas
    out: "./drizzle/migrations", // naming is following industry standard / drizzle kit's default behaviour / drizzle's documentation
    dbCredentials: {
        // Construct the URL using the helper
        url: `postgresql://${process.env.DB_USER}:${password}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    },
    // Optional: Add verbose logging for debugging migrations
    verbose: true, // Makes the terminal output talkative. It will show you the exact SQL strings it's running. This is vital when you are learning or debugging why a migration might be failing.
    strict: true,  // safety feature. In strict mode, Drizzle is more aggressive about ensuring your TypeScript schema matches your database exactly. If there are extra tables in your DB that aren't in your schema, it might warn you or complain, helping you keep your database "clean."
});


