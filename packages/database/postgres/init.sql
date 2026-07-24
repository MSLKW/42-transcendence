-- What should stay in init.sql:
-- 		Keep it for things Drizzle genuinely can't or shouldn't manage:
-- 		CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; — extensions are typically outside app-level migration tools' scope
-- 		Database roles/users, if you manage those at the Postgres level
-- 		One-time seed data, if any (though even this often belongs in a separate seed script, not init.sql)

-- uuid-ossp: Allows you to generate UUIDs (Universally Unique Identifiers) directly inside the database (e.g., DEFAULT gen_random_uuid()).
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- -- ========================================================================
-- -- 						DO NOT RUN THESE UNTIL LAST DEV STAGE
-- -- ========================================================================

-- -- PURPOSE: Harden database security for production.
-- -- RUN VIA: make harden-db (or manual psql execution)
-- -- WARNING: Do not run this until the migration schema is fully stable!
-- -- better use raw sql & directly on postgres. drizzle has limitations to do permissions

-- -- 1. Create users & passwords for each microservices
-- CREATE USER ${POSTGRES_AUTH_USER_NAME} WITH PASSWORD '${POSTGRES_AUTH_USER_PASSWORD}';
-- CREATE USER ${POSTGRES_GAME_USER_NAME} WITH PASSWORD '${POSTGRES_GAME_USER_PASSWORD}';
-- CREATE USER ${POSTGRES_WEBSITE_USER_NAME} WITH PASSWORD '${POSTGRES_WEBSITE_USER_PASSWORD}';

-- -- 2. Revoke default public schema's access from everyone
-- REVOKE ALL ON SCHEMA public FROM PUBLIC;
-- REVOKE ALL ON DATABASE ${POSTGRES_DB} FROM PUBLIC;

-- -- 3. Grant access of specific schema to its own specific user only:

-- ---- (1) Give the auth_schema access ONLY to auth_schema's user
-- GRANT USAGE ON SCHEMA auth_schema TO ${POSTGRES_AUTH_USER_NAME};
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA auth_schema TO ${POSTGRES_AUTH_USER_NAME};
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA auth_schema TO ${POSTGRES_AUTH_USER_NAME};

-- ---- (2) Give the game_schema access ONLY to game_schema's user
-- GRANT USAGE ON SCHEMA game_schema TO ${POSTGRES_GAME_USER_NAME};
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA game_schema TO ${POSTGRES_GAME_USER_NAME};
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA game_schema TO ${POSTGRES_GAME_USER_NAME};

-- ---- (3) Give the bot_schema access ONLY to website_schema's user 
-- GRANT USAGE ON SCHEMA bot_schema TO ${POSTGRES_BOT_USER_NAME};
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA bot_schema TO ${POSTGRES_BOT_USER_NAME};
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA bot_schema TO ${POSTGRES_BOT_USER_NAME};

-- ---- (4) Give the website_schema access ONLY to website_schema's user
-- GRANT USAGE ON SCHEMA website_schema TO ${POSTGRES_WEBSITE_USER_NAME};
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA website_schema TO ${POSTGRES_WEBSITE_USER_NAME};
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA website_schema TO ${POSTGRES_WEBSITE_USER_NAME};

-- ---- (5) Give the chat_schema access ONLY to chat_schema's user 
-- GRANT USAGE ON SCHEMA chat_schema TO ${POSTGRES_CHAT_USER_NAME};
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA chat_schema TO ${POSTGRES_CHAT_USER_NAME};
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA chat_schema TO ${POSTGRES_CHAT_USER_NAME};

