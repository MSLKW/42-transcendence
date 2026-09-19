import { users } from "@big2/auth-schema";
import { pgSchema, uuid, timestamp, index, check, uniqueIndex } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { FRIEND_REQUEST_STATUSES, FRIEND_REQUEST_STATUS } from "@big2/friends-types";


export const friendsSchema = pgSchema("friends_schema");
export const statusEnum = friendsSchema.enum("friend_request_status_enum", FRIEND_REQUEST_STATUSES);


export const friendships = friendsSchema.table("friendships", {
	id: uuid("id") // id for the friendships, not for user_id
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
	},
	(table) => ({
		friendsPairUniqueIdx: uniqueIndex("friends_pair_unique_idx").on(table.friendSmallId, table.friendBigId),
		orderedFriendsPairCheck: check("ordered_friends_pair_check", sql`${table.friendSmallId} < ${table.friendBigId}`),
	})
);



export const friendRequests = friendsSchema.table("friend_requests", {
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
	status: statusEnum("friend_request_status")
		.default(FRIEND_REQUEST_STATUS.PENDING)
		.notNull(),
	createdAt: timestamp("created_at", { withTimezone: true})
		.defaultNow()
		.notNull(),
	pairSmallId: uuid("pair_small_id")
		.generatedAlwaysAs(sql`LEAST(sender_id, receiver_id)`),
	pairBigId: uuid("pair_big_id")
		.generatedAlwaysAs(sql`GREATEST(sender_id, receiver_id)`),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	},
	(table) => ({
		senderReceiverIdx: index("sender_receiver_idx")
			.on(table.senderId, table.receiverId),
		pendingPairUniqueIdx: uniqueIndex("pending_pair_unique_idx")
			.on(table.pairSmallId, table.pairBigId)
			.where(sql`${table.status} = ${sql.raw(`'${FRIEND_REQUEST_STATUS.PENDING}'`)}`),
	})
);

// uniqueIndex here as the safety net for any race conditions 
// guard in the database layer