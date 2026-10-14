const friendsUrl = import.meta.env.VITE_API_FRIENDS_PATH;

export const fetchFriendRequestsReject = async (requestId: string) => {
	const response = await fetch(`${friendsUrl}/friend-requests/${requestId}/reject`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		if (response.status === 400)
			throw new Error("requestId missing or malformed");
		else if (response.status === 404)
			throw new Error("No request with that id");
		else if (response.status === 409)
			throw new Error("Request was already Accepted/Rejected - irreversible");
		throw new Error(`Failed to reject friend request (${response.status} ${response.statusText})`);
	}
}