import { drizzle } from 'drizzle-orm/node-postgres';
import fs from 'fs';
import * as schema from '@big2/database'; 
// Drizzle uses the actual imported schema files. 
// alias maps @big2/database to ../../packages/database/src/auth.schema.ts


if (!process.env.DB_PASSWORD_FILE) {
  throw new Error("CRITICAL: DB_PASSWORD_FILE environment variable is missing!");
}

export const db = drizzle({
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
	password: fs.readFileSync(process.env.DB_PASSWORD_FILE!, 'utf8').trim(),
  },
  schema, // This is shorthand for schema: schema
});