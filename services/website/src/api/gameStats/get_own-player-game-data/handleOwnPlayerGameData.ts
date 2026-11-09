import { useGameStatsStore } from "../../../store/GameStatsStore";
import { fetchOwnPlayerGameData } from "./fetchOwnPlayerGameData";

export const handleOwnPlayerGameData = async () => {
	if (!useGameStatsStore.getState().gameStatsAPIConnection)
		return;

	try {
		const response = await fetchOwnPlayerGameData();
		if (!response)
			return;

		if (useGameStatsStore.getState().gameStatsVerboseMode)
			console.log("[gameStats > 'GET' own-player-game-data] response:", response);

		return response;
	} catch (error) {
		if (useGameStatsStore.getState().gameStatsVerboseMode)
			console.warn("[gameStats > 'GET' own-player-game-data] error:", error);

		return null;
	}
};