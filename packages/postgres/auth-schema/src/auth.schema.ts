import { pgSchema, text, uuid, integer, index, timestamp } from "drizzle-orm/pg-core"; // pg-core specificly means postgres

// 1. Schema Creations => only do schema creation through Drizzle !!
//    Industry Standard: Keep schema names hardcoded in your SQL and your code.
export const authSchema = pgSchema("auth_schema");


// 2. Attach tables to the created schema
//             a. Users Table
export const users = authSchema.table("users", {
  id: uuid("id")
    .primaryKey()
    .defaultRandom(),
  email: text("email")
    .unique()
    .notNull(),
  username: text("username")
    .unique(),
  passwordHash: text("password_hash")
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  failedLoginAttempts: integer("failed_login_attempts")
    .default(0)
    .notNull(),
  lockedUntil: timestamp("locked_until", { withTimezone: true }),
	updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});


//            b. Sessions Table
export const sessions = authSchema.table("sessions", {
  tokenHash: text("token_hash")
    .primaryKey(),
  userId: uuid("user_id")
          .unique()
          .notNull()
          .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true })
    .notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  },
  (table) => [
    index("sessions_expires_at_idx").on(table.expiresAt), // speeds up a future "delete expired sessions" cleanup job
]);
