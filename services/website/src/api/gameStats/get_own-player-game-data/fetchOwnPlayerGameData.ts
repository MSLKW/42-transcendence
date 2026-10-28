const gameStatsUrl = import.meta.env.VITE_API_GAME_STATS_PATH;

export const fetchOwnPlayerGameData = async () => {
	const response = await fetch(`${gameStatsUrl}/own-player-game-data`, {
		method: "GET",
		credentials: "include",
	});

	if (!response.ok) {
		if (response.status === 401)
			throw new Error("No cookie or session invalid / expired");
		else if (response.status === 502)
			throw new Error("Auth answered something unexpected");
		else if (response.status === 503)
			throw new Error("Auth, profile or friends unreachable / database down");
		throw new Error(`Failed to get own player game data (${response.status} ${response.statusText})`);
	}

	return await response.json();
}