import { friendships } from "@big2/friends-system-schema";
import { eq, and, or } from "drizzle-orm";
import { postgres } from "../../config/postgres";
// import { Friendship } from "../models/friendship";
import { FriendshipRepository } from "../interfaces/FriendshipRepository";


export class DrizzleFriendshipRepository implements FriendshipRepository {

	sortPair(a: string, b: string): [string, string] {
		return (a < b ? [a,b] : [b,a]);
	} 

	async areFriends(userA: string, userB: string): Promise<boolean> {
		const [smallId, bigId] = this.sortPair(userA, userB);
		const [resultRow] = await postgres
			.select()
			.from(friendships)
			.where(and(
				eq(friendships.friendSmallId, smallId),
				eq(friendships.friendBigId, bigId)
			))
			.limit(1);
		return (resultRow !== undefined);
	}

	async add(userA: string, userB: string): Promise<void> {
		const [smallId, bigId] = this.sortPair(userA, userB);
		await postgres
			.insert(friendships)
			.values({ 
				friendSmallId: smallId,
				friendBigId: bigId
			})
			.returning();
	}

	async remove(userA: string, userB: string): Promise<boolean> {
		const [smallId, bigId] = this.sortPair(userA, userB);
		const [deletedRow] = await postgres
			.delete(friendships)
			.where(and(
				eq(friendships.friendSmallId, smallId),
				eq(friendships.friendBigId, bigId)
			))
			.returning();
		return (deletedRow !== undefined);
	}

	async fullFriendList(userId: string): Promise<string[]> {
		const resultRows = await postgres
			.select()
			.from(friendships)
			.where(or(
				eq(friendships.friendSmallId, userId),
				eq(friendships.friendBigId, userId)
			));
		return (resultRows
				.map(r => (r.friendSmallId === userId ? r.friendBigId : r.friendSmallId))
		);
	}
};

export const drizzleFriendshipRepository = new DrizzleFriendshipRepository();