# TRIGGER
# 	TRIGGER updatedAt's auto update for any kind of row adjustments
# 	Triggers are per-table. The function is the only reusable part.
# 	Postgres has no schema-wide or wildcard trigger syntax, 
# 	Reusing the name trg_updated_at across tables is fine 
# 	trigger names only need to be unique within a table, not database-wide.

# TRIGGER TERMINOLOGY
# 	"Postgres Trigger" in your log lines is fine. 
# 	The precise technical term for what you built is 
#	==> ( BEFORE UPDATE, FOR EACH ROW ) trigger 
# 	=> a "row-level" trigger (fires once per affected row) 
# 	=> as opposed to a "statement-level" trigger (fires once per SQL statement regardless of row count). 
# 	This exact pattern doesn't have a fancier official name — Postgres folks just call it an "updated_at trigger."

#!/bin/sh
set -e

psql -v ON_ERROR_STOP=1 <<-"EOSQL"

	CREATE OR REPLACE FUNCTION set_updated_at()
	RETURNS TRIGGER AS $$
	BEGIN
		NEW.updated_at = now();
		RETURN NEW;
	END;
	$$ LANGUAGE plpgsql;


	-- CREATE TRIGGER => CREATE TRIGGER OR REPLACE
	-- CREATE TRIGGER is not idempotent — GRANT and ALTER DEFAULT PRIVILEGES are
	-- or else triggers will throw this error message on the next deploy:
	---- ( trigger "trg_updated_at" for relation "users" already exists )

	CREATE OR REPLACE TRIGGER trg_updated_at
	BEFORE UPDATE ON auth_schema.users
	FOR EACH ROW EXECUTE FUNCTION set_updated_at();

	CREATE OR REPLACE TRIGGER trg_updated_at
	BEFORE UPDATE ON auth_schema.sessions
	FOR EACH ROW EXECUTE FUNCTION set_updated_at();

	CREATE OR REPLACE TRIGGER trg_updated_at
	BEFORE UPDATE ON party_manager_schema.player_status
	FOR EACH ROW EXECUTE FUNCTION set_updated_at();

	-- CREATE OR REPLACE TRIGGER trg_updated_at
	-- BEFORE UPDATE ON profile_system_schema.user_info
	-- FOR EACH ROW EXECUTE FUNCTION set_updated_at();

	-- CREATE OR REPLACE TRIGGER trg_updated_at
	-- BEFORE UPDATE ON profile_system_schema.user_settings
	-- FOR EACH ROW EXECUTE FUNCTION set_updated_at();

	-- CREATE OR REPLACE TRIGGER trg_updated_at
	-- BEFORE UPDATE ON game_schema.player_stats
	-- FOR EACH ROW EXECUTE FUNCTION set_updated_at();

EOSQL