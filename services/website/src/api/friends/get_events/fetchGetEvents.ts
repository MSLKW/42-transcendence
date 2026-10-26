const friendsUrl = import.meta.env.VITE_API_FRIENDS_PATH;

export const fetchGetEvents = async () => {
	const response = await fetch(`${friendsUrl}/events`, {
		method: "GET",
		credentials: "include",
	});

	if (!response.ok)
		throw new Error(`Failed to get friend events (${response.status}, ${response.statusText})`);

	return await response.json();
};