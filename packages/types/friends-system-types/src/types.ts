export const FRIEND_REQUEST_STATUSES = [
	"Pending",
	"Accepted",
	"Rejected"
] as const;

export type FriendRequestStatus = typeof FRIEND_REQUEST_STATUSES[number];