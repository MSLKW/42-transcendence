const gameStatsUrl = import.meta.env.VITE_API_GAME_STATS_PATH;

export const fetchPublicPlayerGameData = async (playerUuid: string) => {
	const response = await fetch(`${gameStatsUrl}/public-player-game-data/${playerUuid}`, {
		method: "GET",
		credentials: "include",
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		if (response.status === 400)
			throw new Error("ID in URL is not a UUID");
		else if (response.status === 404)
			throw new Error("No player found with that UUID");
		throw new Error(errorData.message || `Failed to get public player game data (${response.status} ${response.statusText})`);
	}

	return await response.json();
}