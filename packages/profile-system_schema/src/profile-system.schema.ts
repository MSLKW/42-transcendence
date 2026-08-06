import { pgSchema } from "drizzle-orm/pg-core"; // pg-core specificly means postgres

export const profileSystemSchema = pgSchema("profile-system_schema");

// export {};