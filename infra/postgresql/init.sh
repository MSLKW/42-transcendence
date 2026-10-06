#!/bin/bash
# What should stay in init.sh:
#	Keep it for things Drizzle genuinely can't or shouldn't manage
#	Database roles/users, if you manage those at the Postgres level
#	One-time seed data, if any (though even this often belongs in a separate seed script, not init.sql)

# init.sh — stage 1, only ever runs once (on an empty pg-data volume)
# 	every permissiosn, grants, anything - dosent apply to the admin user, thus no explicit rules needed for admin user
#	CREATE USER + GRANT CONNECT never depend on the service being built.
#	a Postgres role can exist with CONNECT permission and literally nothing to use it on yet — no tables, no schema, no app code. That's completely normal and won't error or crash your init script. 
#	Permissions just sit unused until there's something to grant against.

set -e

unset PGHOST PGPORT

AUTH_PW="$( cat /run/secrets/db-auth-password)"
PARTY_PW="$( cat /run/secrets/db-party-password)"
PROFILE_PW="$( cat /run/secrets/db-profile-password)"
FRIENDS_PW="$( cat /run/secrets/db-friends-password)"
GAME_STATS_PW="$( cat /run/secrets/db-game-stats-password)"

# -n = true when string is NONEMPTY
[ -n "$AUTH_PW" ]		|| { echo "[Error] db-auth-password is empty" >&2; exit 1; }
[ -n "$PARTY_PW" ]		|| { echo "[Error] db-party-password is empty" >&2; exit 1; }
[ -n "$PROFILE_PW" ]	|| { echo "[Error] db-profile-password is empty" >&2; exit 1; }
[ -n "$FRIENDS_PW" ]	|| { echo "[Error] db-friends-password is empty" >&2; exit 1; }
[ -n "$GAME_STATS_PW" ]	|| { echo "[Error] db-game-stats-password is empty" >&2; exit 1; }


psql -v ON_ERROR_STOP=1 --username "${POSTGRES_USER}" --dbname "${POSTGRES_DB}" <<-EOSQL

	-- 1. create any extensions that only directly on Postgres can do, not Drizzle
	-- any extensions in the future will be placed here

	-- 2. Create users & passwords for each backend microservices that communicates with database
	CREATE USER "${PGUSER_AUTH}" WITH PASSWORD '${AUTH_PW}';
	CREATE USER "${PGUSER_PARTY}" WITH PASSWORD '${PARTY_PW}';
	CREATE USER "${PGUSER_PROFILE}" WITH PASSWORD '${PROFILE_PW}';
	CREATE USER "${PGUSER_FRIENDS}" WITH PASSWORD '${FRIENDS_PW}';
	CREATE USER "${PGUSER_GAME_STATS}" WITH PASSWORD '${GAME_STATS_PW}';

	-- 3. Revoke default public schema's access from everyone
	REVOKE ALL ON SCHEMA public FROM PUBLIC;
	REVOKE ALL ON DATABASE "${POSTGRES_DB}" FROM PUBLIC;

	-- 4. Re-grant CONNECT ON DATABASE to each role
	GRANT CONNECT ON DATABASE "${POSTGRES_DB}" TO "${PGUSER_AUTH}";
	GRANT CONNECT ON DATABASE "${POSTGRES_DB}" TO "${PGUSER_PARTY}";
	GRANT CONNECT ON DATABASE "${POSTGRES_DB}" TO "${PGUSER_PROFILE}";
	GRANT CONNECT ON DATABASE "${POSTGRES_DB}" TO "${PGUSER_FRIENDS}";
	GRANT CONNECT ON DATABASE "${POSTGRES_DB}" TO "${PGUSER_GAME_STATS}";

EOSQL