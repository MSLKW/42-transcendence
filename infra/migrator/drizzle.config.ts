/// <reference types="node" />
// needed because your file is likely a standalone script or a config file (like drizzle.config.ts) that TypeScript is evaluating outside your main project context.Without that line, TypeScript does not automatically load the global types for Node.js, making it completely unaware of what process even is.
// Global Isolation: TypeScript treats files as isolated modules unless told otherwise. If a file is not explicitly included in your tsconfig.json files array, it won't inherit your project's global type configurations.
// Missing Node Definitions: process is a global object injected by the Node.js runtime, not standard JavaScript. TypeScript needs the @types/node package to understand it.
// The Triple-Slash Fix: The /// <reference types="..." /> directive acts as a local emergency override. It explicitly tells the TypeScript compiler: "For this specific file, explicitly pull in the Node.js type definitions right now."

import fs from "fs";
import 'dotenv/config'; // 1. Load .env files
import { defineConfig } from "drizzle-kit";

// const password = fs.readFileSync(process.env.PGPASSWORD!, "utf8").trim();
// if (!password) {
//   throw new Error("CRITICAL: Database password could not be loaded.");
// }

// 2. Helper to safely read the password
function requirePassword(): string {
  const envPassword = process.env.PGPASSWORD;
  if (envPassword) {
    return envPassword;
  }

  const passwordFile = process.env.PGPASSWORD ?? "/run/secrets/db_admin_password";
  try {
    const password = fs.readFileSync(passwordFile, "utf8").trim();
    if (!password) {
      throw new Error("empty password");
    }
    return password;
  } catch {
    throw new Error("CRITICAL: Database password could not be loaded from PGPASSWORD or PGPASSWORD.");
  }
}


// import 'dotenv/config'; // 1. Load .env files
// import { defineConfig } from "drizzle-kit";


// const password = process.env.PGPASSWORD;
// if (!password) {
//   throw new Error("CRITICAL: Database password could not be loaded.");
// }

// 2. Helper to safely read .env vars and secret
// function requireEnv(name: string): string {
//   const value = process.env[name];
//   if (!value) {
//     throw new Error(`CRITICAL: Missing required environment variable: ${name}`);
//   }
//   return value;
// }

// const dbPort = Number(requireEnv("PGPORT"));
// const dbHost = requireEnv("PGHOST");
// const dbUser = requireEnv("PGUSER");
// const dbName = requireEnv("PGDATABASE");
// const dbPassword = requireEnv("PGPASSWORD");


// 3. Define the main guidance of how Drizzle do its work
// 		defineConfig function = acts as the central control center for Drizzle Kit (your migration tool)
// 		"configuration schema" that tells Drizzle exactly how to talk to your database and where to find your code.
export default defineConfig({
    dialect: "postgresql",  // cannot use env vars and has nothing to do with .env
    schema: [ // points to the "Source of Truth."
      "../../packages/auth_schema/src/index.ts", 
      "../../packages/party-manager_schema/src/index.ts", 
      "../../packages/profile-system_schema/src/index.ts",
      "../../packages/game_schema/src/index.ts"
    ], 
    out: "./migrations", // naming is following industry standard / drizzle kit's default behaviour / drizzle's documentation
    dbCredentials: {
      // host: dbHost,
      // port: dbPort,
      // user: dbUser,
      // password: dbPassword,
      // database: dbName,
        // Construct the URL using the helper
        url: `${process.env.PGHOST}://${process.env.PGUSER}:${requirePassword()}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`,
    },
    // Optional: Add verbose logging for debugging migrations
    verbose: true, // Makes the terminal output talkative. It will show you the exact SQL strings it's running. This is vital when you are learning or debugging why a migration might be failing.
    strict: true,  // safety feature. In strict mode, Drizzle is more aggressive about ensuring your TypeScript schema matches your database exactly. If there are extra tables in your DB that aren't in your schema, it might warn you or complain, helping you keep your database "clean."
});

console.log("~~~yeayy done doing all drizzle.config.ts!~~~");