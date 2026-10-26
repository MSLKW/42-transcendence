const friendsUrl = import.meta.env.VITE_API_FRIENDS_PATH;

export const fetchDeleteFriendships = async (ownerUuid: string, friendUuid: string) => {
	const response = await fetch(`${friendsUrl}/friendships/${ownerUuid}/${friendUuid}`, {
		method: "DELETE",
		credentials: "include",
	});

	if (!response.ok) {
		if (response.status === 400)
			throw new Error("ownerUuid/friendUuid missing or malformed");
		else if (response.status === 404)
			throw new Error("No friendship existed between them");
		throw new Error(`Failed to delete friendship (${response.status} ${response.statusText})`);
	}
};