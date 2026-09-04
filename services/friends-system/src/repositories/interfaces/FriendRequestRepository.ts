import { FriendRequest } from "../../models/friendRequest";
import type { FriendRequestStatus } from "@big2/friends-system-types";

export interface FriendRequestRepository {
	sendRequest(senderId: string, receiverId: string): Promise<FriendRequest>;	findRequestId(requestId: string): Promise<FriendRequest | null>;
	findPendingBothSides(senderId: string, receiverId: string): Promise<FriendRequest | null>;
	findPendingBothSidesReverseCheck(senderId: string, receiverId: string): Promise<FriendRequest | null>;
	listRecievedAndPending(receiverId: string): Promise<FriendRequest[] | null>;
	listSent(senderId: string): Promise<FriendRequest[] | null>;
	updateStatus(requestId: string, status: FriendRequestStatus): Promise<void>;
	updatePendingRequest(userA: string, userB: string, status: FriendRequestStatus): Promise<void>;
};