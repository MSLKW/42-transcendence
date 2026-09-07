	-- CREATE TRIGGER => CREATE TRIGGER OR REPLACE
	-- CREATE TRIGGER is not idempotent — GRANT and ALTER DEFAULT PRIVILEGES are
	-- or else triggers will throw this error message on the next deploy:
	---- ( trigger "trg_updated_at" for relation "users" already exists )
	---- the exact error message by psql themselves if we use CREATE TRIGGER only (on 2nd round running this file): 
	------ psql:/usr/local/bin/user-settings-trigger.sql:14: ERROR:  trigger "trg_create_default_user_settings" for relation "user_data" already exists

CREATE OR REPLACE FUNCTION profile_system_schema.create_default_user_settings()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profile_system_schema.user_settings (id)
    VALUES (NEW.id)
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_create_default_user_settings
AFTER INSERT ON profile_system_schema.user_data
FOR EACH ROW
EXECUTE FUNCTION profile_system_schema.create_default_user_settings();