// import { Friendship } from "../models/friendship";

export interface FriendshipRepository {
	areFriends(userA: string, userB: string): Promise<boolean>;
	add(userA: string, userB: string): Promise<void>;
	remove(userA: string, userB: string): Promise<boolean>;
	fullFriendList(userId: string): Promise<string[]>;
};