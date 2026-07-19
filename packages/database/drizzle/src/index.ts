// //
// import { drizzle } from "drizzle-orm/node-postgres";
// import { Pool } from "pg";
// import * as schema from "./schema";

// // Initialize the raw platform layer connection pool
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

// // Create the shared, type-safe database proxy
// export const db = drizzle(pool, { schema });

// // Export everything together as a single library endpoint
// export * from "./schema";
// export type * from "./schema";
