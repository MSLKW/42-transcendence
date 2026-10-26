import { fetchPublicPlayerGameData } from "./fetchPublicPlayerGameData";

export const handlePublicPlayerGameData = async (playerUuid: string) => {
	try {
		const response = await fetchPublicPlayerGameData(playerUuid);
		if (!response)
			return;

		return response;
	} catch(error) {
		console.warn("[stats > 'GET' public-player-game-data] error:", error);

		return null;
	}
};