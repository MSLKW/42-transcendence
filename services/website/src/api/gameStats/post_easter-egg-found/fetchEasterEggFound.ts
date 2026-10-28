const gameStatsUrl = import.meta.env.VITE_API_GAME_STATS_PATH;

export const fetchEasterEggFound = async (eggId: string) => {
	const response = await fetch(`${gameStatsUrl}/easter-egg-found`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			eggId: eggId
		}),
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		if (response.status === 400)
			throw new Error("Invalid request body");
		else if (response.status === 401)
			throw new Error("Not logged in");
		else if (response.status === 404)
			throw new Error("Unknown egg id / Player does not qualify");
		else if (response.status === 503)
			throw new Error("Profile or friends is down");
		throw new Error(errorData.message || `Failed to sign in (${response.status} ${response.statusText})`);
	}

	return await response.json();
};