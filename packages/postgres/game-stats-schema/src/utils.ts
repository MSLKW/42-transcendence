import { sql } from "drizzle-orm";

// turns ["fresh_deal", "hot_hand"] into 'fresh_deal', 'hot_hand' for use inside a CHECK ... IN (...).
// Single quotes are escaped ('' ) so a value containing one cannot break the SQL.
// Only call this with constants from the code (like BADGE_IDS), never with user input.
export const sqlList = (values: readonly string[]) =>
	sql.raw(values.map((v) => `'${v.replaceAll("'", "''")}'`).join(", "));
