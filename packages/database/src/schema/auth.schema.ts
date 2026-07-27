import { pgSchema, text, uuid, timestamp, integer } from "drizzle-orm/pg-core"; // pg-core specificly means postgres
import { relations } from "drizzle-orm"; // to create relationships


// 1. Schema Creations => only do schema creation through Drizzle !!
//    Industry Standard: Keep schema names hardcoded in your SQL and your code.
export const authSchema = pgSchema("auth_schema");


// 2. Attach tables to that schema
//             Users Table
export const users = authSchema.table("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  username: text("username").unique(),        // Nullable allowed
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  failedLoginAttempts: integer("failed_login_attempts").default(0).notNull(),
  lockedUntil: timestamp("locked_until"),
});


//            Sessions Table
export const sessions = authSchema.table("sessions", {
  token: text("token").primaryKey(),
  userId: uuid("user_id")
          .notNull()
          .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});


// 3. Define relationship ONLY to users 
//      1-to-1 defined by "({ one })"
//      Unidirectional Access ONLY to users as per jeremy's requirement for auth
//      these use Relational Queries (drizzle-orm's relations API).
export const usersRelations = relations(users, ({ one }) => ({
  sessions: one(sessions, {
    fields: [users.id],             // 1. Where do we look in the 'users' table?
    references: [sessions.userId],  // 2. Which column in 'sessions' points back to that ID?
  }),
}));