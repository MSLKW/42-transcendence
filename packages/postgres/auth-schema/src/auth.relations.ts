import { relations } from "drizzle-orm"; // to create relationships
import { users, sessions } from "./auth.schema";

// 1. Define relationship ONLY to users 
//      1-to-1 defined by "({ one })"
//      Unidirectional Access ONLY to users as per jeremy's requirement for auth
//      these use Relational Queries (drizzle-orm's relations API).
export const usersRelations = relations(users, ({ one }) => ({
  sessions: one(sessions, {
    fields: [users.id],             // 1. Where do we look in the 'users' table?
    references: [sessions.userId],  // 2. Which column in 'sessions' points back to that ID?
  }),
}));