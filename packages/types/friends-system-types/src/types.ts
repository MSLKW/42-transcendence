export const FRIEND_REQUEST_STATUSES = [
	"Pending",
	"Accepted",
	"Rejected",
] as const;

export type FriendRequestStatus = typeof FRIEND_REQUEST_STATUSES[number];

export const FRIEND_REQUEST_STATUS = 
{
	PENDING: "Pending",
	ACCEPTED: "Accepted",
	REJECTED: "Rejected",
} as const satisfies Record<string, FriendRequestStatus>;

// satisfies gives you the best of both: 
// a compile error if the value doesn't match the type you expect, 
// while keeping the more precise/specific type for everything downstream 
// (like autocomplete on the object's own keys).