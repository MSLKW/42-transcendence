# -- What should stay in init.sql:
# -- 		Keep it for things Drizzle genuinely can't or shouldn't manage:
# -- 		CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; — extensions are typically outside app-level migration tools' scope
# -- 		Database roles/users, if you manage those at the Postgres level
# -- 		One-time seed data, if any (though even this often belongs in a separate seed script, not init.sql)

# init.sh — stage 1, only ever runs once (on an empty pg_data volume)


#!/bin/bash
set -e

AUTH_PW="$( cat /run/secrets/db_auth_password)"
PARTY_MANAGER_PW="$( cat /run/secrets/db_party-manager_password)"
PROFILE_SYSTEM_PW="$( cat /run/secrets/db_profile-system_password)"
GAME_PW="$( cat /run/secrets/db_game_password)"

psql -v ON_ERROR_STOP=1 --username "${POSTGRES_USER}" --dbname "${POSTGRES_DB}" <<-EOSQL

	-- 1. create any extensions that only diredtly on Postgres can do, not Drizzle
	-- uuid-ossp: Allows you to generate UUIDs (Universally Unique Identifiers) directly inside the database (e.g., DEFAULT gen_random_uuid()).
	CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

	-- 2. Create users & passwords for each backend microservices that communicates with database
	CREATE USER "${POSTGRES_USER_NAME_AUTH}" WITH PASSWORD '${AUTH_PW}';
	CREATE USER "${POSTGRES_USER_NAME_PARTY_MANAGER}" WITH PASSWORD '${PARTY_MANAGER_PW}';
	-- CREATE USER "${POSTGRES_USER_NAME_PROFILE_SYSTEM}" WITH PASSWORD '${PROFILE_SYSTEM_PW}';
	-- CREATE USER "${POSTGRES_USER_NAME_GAME}" WITH PASSWORD '${GAME_PW}';

	-- 3. Revoke default public schema's access from everyone
	REVOKE ALL ON SCHEMA public FROM PUBLIC;
	REVOKE ALL ON DATABASE "${POSTGRES_DB}" FROM PUBLIC;

	-- 4. give connect to the users created
	GRANT CONNECT ON DATABASE "${POSTGRES_DB}" TO "${POSTGRES_USER_NAME_AUTH}";
	GRANT CONNECT ON DATABASE "${POSTGRES_DB}" TO "${POSTGRES_USER_NAME_PARTY_MANAGER}";
	-- GRANT CONNECT ON DATABASE "${POSTGRES_DB}" TO "${POSTGRES_USER_NAME_PROFILE_SYSTEM}";
	-- GRANT CONNECT ON DATABASE "${POSTGRES_DB}" TO "${POSTGRES_USER_NAME_GAME}";

EOSQL
