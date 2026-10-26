import z from "zod";
import { FRIENDS_SERVICE_URL } from "../../../config/env";


// 1. setup rules' values & schemas for FRIENDS
const FRIEND_GOAL = 42;
const FriendshipListSchema = z.array(z.uuid());


// 2. fetch and check
export async function checkFriendCount(playerUuid: string): Promise<boolean>
{
	const res = await fetch(`${FRIENDS_SERVICE_URL}/friendships/${playerUuid}`, {
		signal: AbortSignal.timeout(3000),
	});
	if (!res.ok)
		throw new Error(`friends responded ${res.status}`);

	const friends = FriendshipListSchema.parse(await res.json());
	return (friends.length >= FRIEND_GOAL);
}
