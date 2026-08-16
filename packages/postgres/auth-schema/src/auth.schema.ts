import { pgSchema, text, uuid, timestamp, integer } from "drizzle-orm/pg-core"; // pg-core specificly means postgres
// import { profileSystemSchema } from "@big2/profile-system-schema";


// 1. Schema Creations => only do schema creation through Drizzle !!
//    Industry Standard: Keep schema names hardcoded in your SQL and your code.
export const authSchema = pgSchema("auth_schema");


// 2. Attach tables to the created schema
//             a. Users Table
export const users = authSchema.table("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  username: text("username")
    .unique(),
    // .references(() => profileSystemSchema.userData.id, { onDelete: "cascade" }),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  failedLoginAttempts: integer("failed_login_attempts").default(0).notNull(),
  lockedUntil: timestamp("locked_until"),
});


//            b. Sessions Table
export const sessions = authSchema.table("sessions", {
  token: text("token").primaryKey(),
  userId: uuid("user_id")
          .notNull()
          .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});