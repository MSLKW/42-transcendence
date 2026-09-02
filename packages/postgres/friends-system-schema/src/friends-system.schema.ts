import { users } from "@big2/auth-schema";
import { pgSchema, uuid } from "drizzle-orm/pg-core";
import { REQUEST_STATUSES } from "@big2/friends-system-types";


export const friendsSystemSchema = pgSchema("friends_system_schema");
export const requestStatusEnum = friendsSystemSchema.enum("request_status", REQUEST_STATUSES);

