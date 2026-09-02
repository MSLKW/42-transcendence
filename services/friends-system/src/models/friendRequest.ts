import type { FriendRequestStatus } from "@big2/friends-system-types";

export interface FriendRequest {
	id: string;
	senderId: string;
	receiverId: string;
	status: FriendRequestStatus;
	createdAt: Date;
}