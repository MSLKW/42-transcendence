/// <reference types="node" />
// needed because your file is likely a standalone script or a config file (like drizzle.config.ts) that TypeScript is evaluating outside your main project context.Without that line, TypeScript does not automatically load the global types for Node.js, making it completely unaware of what process even is.
// Global Isolation: TypeScript treats files as isolated modules unless told otherwise. If a file is not explicitly included in your tsconfig.json files array, it won't inherit your project's global type configurations.
// Missing Node Definitions: process is a global object injected by the Node.js runtime, not standard JavaScript. TypeScript needs the @types/node package to understand it.
// The Triple-Slash Fix: The /// <reference types="..." /> directive acts as a local emergency override. It explicitly tells the TypeScript compiler: "For this specific file, explicitly pull in the Node.js type definitions right now."


import fs from "fs";
import 'dotenv/config'; 
import { defineConfig } from "drizzle-kit";


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

export const PGPASSWORD_FILE    = requireEnvNum("PGPASSWORD_FILE");  // throws if not set or empty in compose
export const PGPORT             = requireEnvNum("PGPORT");
export const PGHOST             = requireEnv("PGHOST");
export const PGDATABASE         = requireEnv("PGDATABASE");
export const PGUSER             = requireEnv("PGUSER");
export const PGUSER_AUTH        = requireEnv("PGUSER_AUTH");
export const PGUSER_PARTY       = requireEnv("PGUSER_PARTY");
export const PGUSER_PROFILE     = requireEnv("PGUSER_PROFILE");
export const PGUSER_GAME_STATS  = requireEnv("PGUSER_GAME_STATS");
export const PGUSER_FRIENDS     = requireEnv("PGUSER_FRIENDS");

const PGPASSWORD = fs.readFileSync(PGPASSWORD_FILE, 'utf-8').trim();    // readFileSync throws ENOENT and names the path, if doesn't exist
if (!PGPASSWORD)
  throw new Error(`[Error] password file ${PGPASSWORD_FILE} is empty`); // throw if empty or only whitespace

// 3. Define the main guidance of how Drizzle do its work
// 		defineConfig function = acts as the central control center for Drizzle Kit (your migration tool)
// 		"configuration schema" that tells Drizzle exactly how to talk to your database and where to find your code.
export default defineConfig({
    dialect: "postgresql",  // cannot use env vars and has nothing to do with .env
    schema: [ // points to the "Source of Truth."
      "../../packages/postgres/auth-schema/src/index.ts", 
      "../../packages/postgres/party-schema/src/index.ts", 
      "../../packages/postgres/friends-schema/src/index.ts", 
      "../../packages/postgres/game-stats-schema/src/index.ts",
      "../../packages/postgres/profile-schema/src/index.ts",
    ], 
    out: "./migrations", // naming is following industry standard / drizzle kit's default behaviour / drizzle's documentation
    dbCredentials: {
        // Construct the URL using the helper
        url: `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}`,
    },
    // Optional: Add verbose logging for debugging migrations
    verbose: true, // Makes the terminal output talkative. It will show you the exact SQL strings it's running. This is vital when you are learning or debugging why a migration might be failing.
    strict: true,  // safety feature. In strict mode, Drizzle is more aggressive about ensuring your TypeScript schema matches your database exactly. If there are extra tables in your DB that aren't in your schema, it might warn you or complain, helping you keep your database "clean."
});

console.log("Complete running through migrator's drizzle.config.ts");