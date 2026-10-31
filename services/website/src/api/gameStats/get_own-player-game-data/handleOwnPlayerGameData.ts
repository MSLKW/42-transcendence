import { useGameStatsStore } from "../../../store/GameStatsStore";
import { fetchOwnPlayerGameData } from "./fetchOwnPlayerGameData";

export const handleOwnPlayerGameData = async () => {
	try {
		const response = await fetchOwnPlayerGameData();
		if (!response)
			return;

		if (useGameStatsStore.getState().gameStatsVerboseMode)
			console.log("[gameStats > 'GET' own-player-game-data] response:", response);

		return response;
	} catch(error) {
		console.warn("[gameStats > 'GET' own-player-game-data] error:", error);

		return null;
	}
};