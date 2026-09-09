import type { FriendRequestStatus } from "@big2/friends-system-types";
import { friendRequests } from "@big2/friends-system-schema";
import { eq, and, or } from "drizzle-orm";
import { postgresClient } from "../../config/postgresClient";
import { FriendRequest } from "../../models/friendRequest";
import { FriendRequestRepository } from "../interfaces/FriendRequestRepository";


export class DrizzleFriendRequestRepository implements FriendRequestRepository {

	async sendRequest(senderId: string, receiverId: string): Promise<FriendRequest> {
		const [resultRow] = await postgresClient
			.insert(friendRequests)
			.values({ 
				senderId: senderId, 
				receiverId: receiverId,
			})
			.returning();
		return (resultRow);
	}

	async findRequestId(id: string): Promise<FriendRequest | null> {
		const [resultRow] = await postgresClient
			.select()
			.from(friendRequests)
			.where(eq(friendRequests.id, id))
			.limit(1);
		return (resultRow ?? null);
	}

	async findPendingBothSides(senderId: string, receiverId: string): Promise<FriendRequest | null> {
		const [resultRow] = await postgresClient
			.select()
			.from(friendRequests)
			.where(and(
				eq(friendRequests.senderId, senderId),
				eq(friendRequests.receiverId, receiverId),
				eq(friendRequests.status, "Pending" as FriendRequestStatus)
			))
			.limit(1);
		return (resultRow ?? null);
	}

	async findPendingBothSidesReverseCheck(senderId: string, receiverId: string): Promise<FriendRequest | null> {
		const [resultRow] = await postgresClient
			.select()
			.from(friendRequests)
			.where(and(
				eq(friendRequests.senderId, receiverId),
				eq(friendRequests.receiverId, senderId),
				eq(friendRequests.status, "Pending" as FriendRequestStatus),
			))
			.limit(1);
		return (resultRow ?? null);
	}

	async listRecievedAndPending(receiverId: string): Promise<FriendRequest[] | null> {
		const resultRows =  await postgresClient
			.select()
			.from(friendRequests)
			.where(and(
				eq(friendRequests.receiverId, receiverId),
				eq(friendRequests.status, "Pending" as FriendRequestStatus)
			));
		return (resultRows ?? null);
	}

	async listSent(senderId: string): Promise<FriendRequest[] | null> {
		const resultRows = await postgresClient
			.select()
			.from(friendRequests)
			.where(eq(friendRequests.senderId, senderId));
		return (resultRows ?? null);
	}

	async updateStatus(requestId: string, status: FriendRequestStatus): Promise<void> {
		await postgresClient
			.update(friendRequests)
			.set({ status: status })
			.where(eq(friendRequests.id, requestId));
	}

	async updatePendingRequest(userA: string, userB: string, status: FriendRequestStatus): Promise<void> {
		await postgresClient
			.update(friendRequests)
			.set({ status: status })
			.where(
				and(eq(friendRequests.status, "Pending" as FriendRequestStatus),
				or(
					and(eq(friendRequests.senderId, userA), eq(friendRequests.receiverId, userB)),
					and(eq(friendRequests.senderId, userB), eq(friendRequests.receiverId, userA))
				)
			));
	}
};

export const drizzleFriendRequestRepository = new DrizzleFriendRequestRepository();