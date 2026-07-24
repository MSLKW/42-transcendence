-- What should stay in init.sql:
-- 		Keep it for things Drizzle genuinely can't or shouldn't manage:
-- 		CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; — extensions are typically outside app-level migration tools' scope
-- 		Database roles/users, if you manage those at the Postgres level
-- 		One-time seed data, if any (though even this often belongs in a separate seed script, not init.sql)

-- uuid-ossp: Allows you to generate UUIDs (Universally Unique Identifiers) directly inside the database (e.g., DEFAULT gen_random_uuid()).
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

