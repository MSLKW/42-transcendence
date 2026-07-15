import { pgSchema, uuid, text } from "drizzle-orm/pg-core"

export const authSchema = pgSchema("auth_schema"); // exported with the export keyword

export const users = authSchema.table("users", {  // exported
  id: uuid("is").primaryKey().defaultRandom(),
})