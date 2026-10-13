const friendsUrl = import.meta.env.VITE_API_FRIENDS_PATH;

export const fetchFriendRequestsSent = async (senderUuid: string) => {
	const response = await fetch(`${friendsUrl}/friend-requests/sent/${senderUuid}`, {
		method: "GET",
		credentials: "include",
	});

	if (!response.ok) {
		if (response.status === 400)
			throw new Error("senderUuid missing or malformed");
		throw new Error(`Failed to get all sent friend requests (${response.status}, ${response.statusText})`);
	}

	return await response.json();
};