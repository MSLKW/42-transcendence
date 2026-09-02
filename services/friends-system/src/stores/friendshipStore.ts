// import { Friendship } from "../models/friendship";

export interface FriendshipStore {
	areFriends(userA: string, userB: string): Promise<boolean>;
	add(userA: string, userB: string): Promise<void>;
	remove(userA: string, userB: string): Promise<boolean>;
	fullFriendList(userId: string): Promise<string[]>;
};