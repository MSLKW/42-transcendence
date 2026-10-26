import { fetchOwnPlayerGameData } from "./fetchOwnPlayerGameData";

export const handleOwnPlayerData = async () => {
	try {
		const response = await fetchOwnPlayerGameData();
		if (!response)
			return;

		return response;
	} catch(error) {
		console.warn("[stats > 'GET' own-player-game-data] error:", error);

		return null;
	}
};