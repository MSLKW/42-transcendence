import { defineConfig } from "drizzle-kit";
import "dotenv/config"; // This automatically loads the local .env

export default defineConfig({
	schema: "./src/*.schema.ts", // points to isolated schema files
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL!, // Locally, this works.
	},
});