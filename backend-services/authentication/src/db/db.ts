import { drizzle } from 'drizzle-orm/node-postgres';

// Drizzle uses the actual imported schema files. 
// Because your path alias maps @big2/database to ../../packages/database/src/
import * as schema from '@big2/database/src/auth.schema'; 

import fs from 'fs';

// This reads the secret file once when the service starts
if (!process.env.DB_PASSWORD_FILE) {
  throw new Error("CRITICAL: DB_PASSWORD_FILE environment variable is missing!");
}

const db = drizzle({
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
	password: fs.readFileSync(process.env.DB_PASSWORD_FILE!, 'utf8').trim(),
  },
  schema, // This is shorthand for schema: schema
});