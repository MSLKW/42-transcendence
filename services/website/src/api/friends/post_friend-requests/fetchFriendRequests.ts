const friendsUrl = import.meta.env.VITE_API_FRIENDS_PATH;

export const fetchFriendRequests = async (senderId: string, receiverId: string) => {
	const response = await fetch(`${friendsUrl}/friend-requests`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ senderId, receiverId }),
	});

	if (!response.ok) {
		if (response.status === 400)
			throw new Error("Missing/malformed senderId/receiverId or senderId === receiverId");
		else if (response.status === 404)
			throw new Error("receiverId does not exist (FK violation)");
		else if (response.status === 409)
			throw new Error("Already friends / request is already pending");
		else if (response.status === 500)
			throw new Error("Unexpected server error");
		throw new Error(`Failed to send friend request (${response.status} ${response.statusText})`);
	}
}