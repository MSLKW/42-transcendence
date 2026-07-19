-- init.sql -> just creating schema, thats it.
-- this happen in Postgres
-- Creating Postgres Schemas (folders within Postgres)
-- These are not public Postgres Schema
-- Industry Standard: Keep schema names hardcoded in your SQL and your code.

-- uuid-ossp: Allows you to generate UUIDs (Universally Unique Identifiers) directly inside the database (e.g., DEFAULT gen_random_uuid()).
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE SCHEMA IF NOT EXISTS auth_schema;
CREATE SCHEMA IF NOT EXISTS game_schema;
CREATE SCHEMA IF NOT EXISTS bot_schema;
CREATE SCHEMA IF NOT EXISTS website_schema;
CREATE SCHEMA IF NOT EXISTS chat_schema;
