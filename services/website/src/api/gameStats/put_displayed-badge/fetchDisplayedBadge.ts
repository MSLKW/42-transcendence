const gameStatsUrl = import.meta.env.VITE_API_GAME_STATS_PATH;

export const fetchDisplayedBadge = async (badgeId: string) => {
	const response = await fetch(`${gameStatsUrl}/displayed-badge`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			badgeId: badgeId,
		}),
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		if (response.status === 400)
			throw new Error("Not a known badge ID");
		else if (response.status === 401)
			throw new Error("Not logged in");
		else if (response.status === 403)
			throw new Error("Cannot change badge - Player has not unlocked this badge");
		throw new Error(errorData.message || `Failed to change badge (${response.status} ${response.statusText})`);
	}

	return response;
}