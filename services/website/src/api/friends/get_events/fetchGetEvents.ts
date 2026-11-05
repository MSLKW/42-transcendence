const friendsUrl = import.meta.env.VITE_API_FRIENDS_PATH;

export const fetchGetEvents = async () => {
	const response = await fetch(`${friendsUrl}/events`, {
		method: "GET",
		credentials: "include",
	});

	if (!response.ok)
		throw new Error(`Failed to get friend events (${response.status}, ${response.statusText})`);

	const text = await response.text();
	if (!text || text.trim() === "")
		return [];
	return JSON.parse(text);
};