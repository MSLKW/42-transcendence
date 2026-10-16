import { sql } from "drizzle-orm";

// turns ["A", "Beginner's Luck"] into 'A', 'Beginner''s Luck' (read normally as "Beginner's Luck")
export const sqlList = (values: readonly string[]) =>
	sql.raw(values.map((v) => `'${v.replaceAll("'", "''")}'`).join(", "));
