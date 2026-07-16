/// <reference types="node" />
import { defineConfig } from "drizzle-kit";
import fs from "fs";
// import "dotenv/config"; // This automatically loads the local .env

// Read the secret file directly. Docker places it here when using the 'secrets:' block.
const dbPassword = fs.readFileSync("/run/secrets/db_admin_password", "utf8").trim();

export default defineConfig({
	schema: "./src/index.ts", // points to main schema file pointing to other schemas
	out: "./migrations",
	dialect: "postgresql",
	dbCredentials: {
		// url: dbUrl,		
		// url: process.env.DATABASE_URL!, // Locally, this works.
		// Construct the URL right here using the secret and environment variables
		url: `postgresql://${process.env.DB_USER}:${dbPassword}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
	},
});