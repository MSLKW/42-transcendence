import { useGameStatsStore } from "../../../store/GameStatsStore";
import { fetchPublicPlayerGameData } from "./fetchPublicPlayerGameData";

export const handlePublicPlayerGameData = async (playerUuid: string) => {
	try {
		const response = await fetchPublicPlayerGameData(playerUuid);
		if (!response)
			return;

		if (useGameStatsStore.getState().gameStatsVerboseMode)
			console.log("[gameStats > 'GET' public-player-game-data] response:", response);

		return response;
	} catch(error) {
		console.warn("[gameStats > 'GET' public-player-game-data] error:", error);

		return null;
	}
};