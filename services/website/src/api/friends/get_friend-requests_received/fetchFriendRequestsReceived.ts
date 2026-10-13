const friendsUrl = import.meta.env.VITE_API_FRIENDS_PATH;

export const fetchFriendRequestsReceived = async (receiverUuid: string) => {
	const response = await fetch(`${friendsUrl}/friend-requests/received/${receiverUuid}`, {
		method: "GET",
		credentials: "include",
	});

	if (!response.ok) {
		if (response.status === 400)
			throw new Error("requestId missing or malformed");
		throw new Error(`Failed to get incoming friend requests (${response.status}, ${response.statusText})`);
	}

	return await response.json();
};