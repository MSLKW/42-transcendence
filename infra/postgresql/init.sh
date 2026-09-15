# What should stay in init.sh:
#	Keep it for things Drizzle genuinely can't or shouldn't manage
#	Database roles/users, if you manage those at the Postgres level
#	One-time seed data, if any (though even this often belongs in a separate seed script, not init.sql)

# init.sh — stage 1, only ever runs once (on an empty pg-data volume)
# 	every permissiosn, grants, anything - dosent apply to the admin user, thus no explicit rules needed for admin user
#	CREATE USER + GRANT CONNECT never depend on the service being built.
#	a Postgres role can exist with CONNECT permission and literally nothing to use it on yet — no tables, no schema, no app code. That's completely normal and won't error or crash your init script. 
#	Permissions just sit unused until there's something to grant against.

#!/bin/bash
set -e

unset PGHOST PGPORT

AUTH_PW="$( cat /run/secrets/db-auth-password)"
PARTY_MANAGER_PW="$( cat /run/secrets/db-party-manager-password)"
PROFILE_SYSTEM_PW="$( cat /run/secrets/db-profile-system-password)"
FRIENDS_SYSTEM_PW="$( cat /run/secrets/db-friends-system-password)"
# GAME_PW="$( cat /run/secrets/db-game-password)"

psql -v ON_ERROR_STOP=1 --username "${PGUSER}" --dbname "${PGDATABASE}" <<-EOSQL

	-- 1. create any extensions that only directly on Postgres can do, not Drizzle
	-- any extensions in the future will be placed here

	-- 2. Create users & passwords for each backend microservices that communicates with database
	CREATE USER "${PGUSER_AUTH}" WITH PASSWORD '${AUTH_PW}';
	CREATE USER "${PGUSER_PARTY_MANAGER}" WITH PASSWORD '${PARTY_MANAGER_PW}';
	CREATE USER "${PGUSER_PROFILE_SYSTEM}" WITH PASSWORD '${PROFILE_SYSTEM_PW}';
	CREATE USER "${PGUSER_FRIENDS_SYSTEM}" WITH PASSWORD '${FRIENDS_SYSTEM_PW}';
	-- CREATE USER "${PGUSER_GAME}" WITH PASSWORD '${GAME_PW}';

	-- 3. Revoke default public schema's access from everyone
	REVOKE ALL ON SCHEMA public FROM PUBLIC;
	REVOKE ALL ON DATABASE "${PGDATABASE}" FROM PUBLIC;

	-- 4. Re-grant CONNECT ON DATABASE to each role
	GRANT CONNECT ON DATABASE "${PGDATABASE}" TO "${PGUSER_AUTH}";
	GRANT CONNECT ON DATABASE "${PGDATABASE}" TO "${PGUSER_PARTY_MANAGER}";
	GRANT CONNECT ON DATABASE "${PGDATABASE}" TO "${PGUSER_PROFILE_SYSTEM}";
	GRANT CONNECT ON DATABASE "${PGDATABASE}" TO "${PGUSER_FRIENDS_SYSTEM}";
	-- GRANT CONNECT ON DATABASE "${PGDATABASE}" TO "${PGUSER_GAME}";

EOSQL