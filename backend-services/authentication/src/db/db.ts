import { drizzle } from 'drizzle-orm/node-postgres';  // /postgres-js";
import fs from 'fs';
import * as authSchema from '@big2/database'; 
// Drizzle uses the actual imported schema files. 
// alias maps "@big2/database" to "../../packages/database/drizzle/src/schema/auth.schema.ts" (tsconfig.json)


if (!process.env.DB_PASSWORD_FILE) {
  throw new Error("CRITICAL: DB_PASSWORD_FILE environment variable is missing!");
}

export const db = drizzle({
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
	  password: fs.readFileSync(process.env.DB_PASSWORD_FILE!, 'utf8').trim(),
    port: parseInt(process.env.DB_PORT || "5432", 10),
  },
  schema: authSchema
});