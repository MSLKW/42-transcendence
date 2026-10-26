const friendsUrl = import.meta.env.VITE_API_FRIENDS_PATH;

export const fetchFriendships = async (ownerUuid: string) => {
	const response = await fetch(`${friendsUrl}/friendships/${ownerUuid}`, {
		method: "GET",
		credentials: "include",
	});

	if (!response.ok) {
		if (response.status === 400)
			throw new Error("ownerUuid missing or malformed");
		throw new Error(`Failed to get user's friends (${response.status}, ${response.statusText})`);
	}

	return await response.json();
};