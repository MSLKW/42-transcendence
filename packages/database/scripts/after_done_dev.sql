-- PURPOSE: Harden database security for production.
-- RUN VIA: make harden-db (or manual psql execution)
-- WARNING: Do not run this until the migration schema is fully stable!
-- Drizzle's sql tag correctly to prevent SQL Injection and handle the variables properly.


import { sql } from "drizzle-orm";
import { db } from "../index"; // Ensure this is your 'drizzle' client

export async function up() {
  -- Use 'sql' tagged template to safely execute
  await db.execute(sql`
	-- 1. Create users & passwords for each microservices
	CREATE USER ${sql.raw(process.env.POSTGRES_AUTH_USER_NAME!)} WITH PASSWORD ${process.env.POSTGRES_AUTH_USER_PASSWORD!};
	CREATE USER ${sql.raw(process.env.POSTGRES_GAME_USER_NAME!)} WITH PASSWORD ${process.env.POSTGRES_GAME_USER_PASSWORD!};
	CREATE USER ${sql.raw(process.env.POSTGRES_WEBSITE_USER_NAME!)} WITH PASSWORD ${process.env.POSTGRES_WEBSITE_USER_PASSWORD!};

	-- 2. Revoke default public schema's access from everyone
	REVOKE ALL ON SCHEMA public FROM PUBLIC;
	REVOKE ALL ON DATABASE ${sql.raw(process.env.POSTGRES_DB!)} FROM PUBLIC;

	-- 3. Grant access of specific schema to its own specific user only:

	---- (1) Give the auth_schema access ONLY to auth_schema's user
	GRANT USAGE ON SCHEMA auth_schema TO ${sql.raw(process.env.POSTGRES_AUTH_USER_NAME!)};
	GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA auth_schema TO ${sql.raw(process.env.POSTGRES_AUTH_USER_NAME!)};
	GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA auth_schema TO ${sql.raw(process.env.POSTGRES_AUTH_USER_NAME!)};

	---- (2) Give the game_schema access ONLY to game_schema's user
	GRANT USAGE ON SCHEMA game_schema TO ${sql.raw(process.env.POSTGRES_GAME_USER_NAME!)};
	GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA game_schema TO ${sql.raw(process.env.POSTGRES_GAME_USER_NAME!)};
	GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA game_schema TO ${sql.raw(process.env.POSTGRES_GAME_USER_NAME!)};

	---- (3) Give the bot_schema access ONLY to website_schema's user 
	GRANT USAGE ON SCHEMA bot_schema TO ${sql.raw(process.env.POSTGRES_BOT_USER_NAME!)};
	GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA bot_schema TO ${sql.raw(process.env.POSTGRES_BOT_USER_NAME!)};
	GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA bot_schema TO ${sql.raw(process.env.POSTGRES_BOT_USER_NAME!)};

	---- (4) Give the website_schema access ONLY to website_schema's user
	GRANT USAGE ON SCHEMA website_schema TO ${sql.raw(process.env.POSTGRES_WEBSITE_USER_NAME!)};
	GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA website_schema TO ${sql.raw(process.env.POSTGRES_WEBSITE_USER_NAME!)};
	GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA website_schema TO ${sql.raw(process.env.POSTGRES_WEBSITE_USER_NAME!)};

	---- (5) Give the chat_schema access ONLY to chat_schema's user 
	GRANT USAGE ON SCHEMA chat_schema TO ${sql.raw(process.env.POSTGRES_CHAT_USER_NAME!)};
	GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA chat_schema TO ${sql.raw(process.env.POSTGRES_CHAT_USER_NAME!)};
	GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA chat_schema TO ${sql.raw(process.env.POSTGRES_CHAT_USER_NAME!)};

	`);
}