/// <reference types="node" />
import { defineConfig } from "drizzle-kit";
import "dotenv/config"; // This automatically loads the local .env

export default defineConfig({
	schema: "./src/index.ts", // points to main schema file pointing to other schemas
	out: "./migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL!, // Locally, this works.
	},
});