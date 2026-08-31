import { users } from "@big2/auth-schema";
import { pgSchema, uuid, jsonb, timestamp, index, check, uniqueIndex } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { RequestStatus } from "@big2/friends-system-types";


export const friendsSystemSchema = pgSchema("friends_system_schema");


export const friendships = friendsSystemSchema.table("friendships", {
	id: uuid("id") // id for the friendship connections, not for user_id
		.defaultRandom()
		.primaryKey()
		.notNull(),
	friendSmallId: uuid("friend_small_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	friendBigId: uuid("friend_big_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true})
		.defaultNow()
		.notNull(),
}, (table) => ({
  friendsPairUniqueIdx: uniqueIndex("friends_pair_unique_idx").on(table.friendSmallId, table.friendBigId),
  orderedFriendsPairCheck: check("ordered_friends_pair_check", sql`${table.friendSmallId} < ${table.friendBigId}`),
}));



export const friendRequests = friendsSystemSchema.table("friend_requests", {
	id: uuid("id") // id for the friend_requests, not for user_id
		// .unique() => primaryKey already guarantees uniqueness
		.primaryKey()
		.defaultRandom(),
	senderId: uuid("sender_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	receiverId: uuid("receiver_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	status: jsonb("status")
		.$type<RequestStatus>()
		.default("Pending")
		.notNull(),
	createdAt: timestamp("created_at", { withTimezone: true})
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
}, (table) => ({
  senderReceiverIdx: index("sender_receiver_indx").on(table.senderId, table.receiverId),
}));