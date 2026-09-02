export const REQUEST_STATUSES = [
	"Pending",
	"Accepted",
	"Rejected"
] as const;

export type RequestStatus = typeof REQUEST_STATUSES[number];