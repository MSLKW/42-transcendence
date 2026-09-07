# ==========================================================================================
# --		ESTABLISHEMENT OF PRIVATE SCHEMAS TO BE MICROSERVICES' "LOSSELY-COUPLED SERVICES"	
# ==========================================================================================

# PURPOSE: Harden database security for production.
# WARNING: Do not run this until the migration schema is fully stable! (done!)
# better use raw sql & directly on postgres. drizzle has limitations to do permissions
# must be implemented and tested already since during in development stage 
# --	- to catch anything that cannot be workable for private schemas establishements , less last minute stress too lol  

# grant-permissions.sh — stage 2, run this AFTER the migrate command
# inside migrator's own entrypoint/script, once schemas+tables actually exist.
# It's safe to run every single deploy — GRANT and ALTER DEFAULT PRIVILEGES
# are both idempotent, so re-running them changes nothing if already applied,
# and correctly picks up any brand-new tables from that deploy's migrations.

# 1. Grant access of specific schema to its own specific user only:
# privilege = just a specific permission a role (user) is allowed to perform on a specific database object.
# syntax: GRANT <privileges> ON <object> TO <role>
# objects: Schema, Table, Sequence
# notes:
# 		ALL PRIVILEGES is shorthand for "every privilege that applies to this object type."
# 		Schema: USAGE (allowed to "see into" / reference things inside it — without this, even having table permissions doesn't help, since the role can't even look the table up), CREATE (allowed to create new objects inside it).
# 		Table: SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER.
# 		Sequence: USAGE, SELECT, UPDATE — needed because auto-incrementing columns (SERIAL/IDENTITY) are backed by a sequence object under the hood, and inserting a row calls nextval() on it, which requires its own permission separate from the table's.
# [GRANT ... ON ALL TABLES IN SCHEMA x] is a one-time snapshot — it only touches tables that exist right now, at the moment you run it.
# [ALTER DEFAULT PRIVILEGES] doesn't grant anything itself. It sets up a standing rule: "from now on, whenever role X creates a new table in schema Y, automatically attach these privileges to it for role Z."
# use both together: the direct GRANT covers what exists NOW, ALTER DEFAULT PRIVILEGES covers what gets created going forward.
# for schema object, just grant USAGE only, coz admin user is the only one that can CREATE

# original:
# 	psql -v ON_ERROR_STOP=1 --host "${PGHOST}" --port "${PGPORT}" --username "${PGUSER}" --dbname "${PGDATABASE}" <<-EOSQL
# more explicite to the local socket path. That's fully explicit, self-documenting, and correct — no ambiguity about where it's connecting, no TCP race:
# 	psql -v ON_ERROR_STOP=1 --host=/var/run/postgresql --username "${PGUSER}" --dbname "${PGDATABASE}" <<-EOSQL 


#!/bin/sh
set -e

export PGPASSWORD="$(cat /run/secrets/db-admin-password)"

psql -v ON_ERROR_STOP=1 <<-EOSQL

	---- (1) auth_schema
	GRANT USAGE ON SCHEMA auth_schema TO "${PGUSER_AUTH}";
	GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA auth_schema TO "${PGUSER_AUTH}";
	GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA auth_schema TO "${PGUSER_AUTH}";
	ALTER DEFAULT PRIVILEGES FOR ROLE "${PGUSER}" IN SCHEMA auth_schema
		GRANT ALL PRIVILEGES ON TABLES TO "${PGUSER_AUTH}";
	ALTER DEFAULT PRIVILEGES FOR ROLE "${PGUSER}" IN SCHEMA auth_schema
		GRANT ALL PRIVILEGES ON SEQUENCES TO "${PGUSER_AUTH}";

	---- (2) party_manager_schema
	GRANT USAGE ON SCHEMA party_manager_schema TO "${PGUSER_PARTY_MANAGER}";
	GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA party_manager_schema TO "${PGUSER_PARTY_MANAGER}";
	GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA party_manager_schema TO "${PGUSER_PARTY_MANAGER}";
	ALTER DEFAULT PRIVILEGES FOR ROLE "${PGUSER}" IN SCHEMA party_manager_schema
		GRANT ALL PRIVILEGES ON TABLES TO "${PGUSER_PARTY_MANAGER}";
	ALTER DEFAULT PRIVILEGES FOR ROLE "${PGUSER}" IN SCHEMA party_manager_schema
		GRANT ALL PRIVILEGES ON SEQUENCES TO "${PGUSER_PARTY_MANAGER}";

	---- (3) profile_system_schema
	GRANT USAGE ON SCHEMA profile_system_schema TO "${PGUSER_PROFILE_SYSTEM}";
	GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA profile_system_schema TO "${PGUSER_PROFILE_SYSTEM}";
	GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA profile_system_schema TO "${PGUSER_PROFILE_SYSTEM}";
	ALTER DEFAULT PRIVILEGES FOR ROLE "${PGUSER}" IN SCHEMA profile_system_schema
		GRANT ALL PRIVILEGES ON TABLES TO "${PGUSER_PROFILE_SYSTEM}";
	ALTER DEFAULT PRIVILEGES FOR ROLE "${PGUSER}" IN SCHEMA profile_system_schema
		GRANT ALL PRIVILEGES ON SEQUENCES TO "${PGUSER_PROFILE_SYSTEM}";
       
	-- ---- (4) game_schema
	-- GRANT USAGE ON SCHEMA game_schema TO "${PGUSER_GAME}";
	-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA game_schema TO "${PGUSER_GAME}";
	-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA game_schema TO "${PGUSER_GAME}";
	-- ALTER DEFAULT PRIVILEGES FOR ROLE "${PGUSER}" IN SCHEMA game_schema
	-- 	GRANT ALL PRIVILEGES ON TABLES TO "${PGUSER_GAME}";
	-- ALTER DEFAULT PRIVILEGES FOR ROLE "${PGUSER}" IN SCHEMA game_schema
	-- 	GRANT ALL PRIVILEGES ON SEQUENCES TO "${PGUSER_GAME}";

EOSQL