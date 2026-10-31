import { useGameStatsStore } from "../../../store/GameStatsStore";
import { fetchEasterEggFound } from "./fetchEasterEggFound";

export const handleEasterEggFound = async (eggId: string) => {
	try {
		const response = await fetchEasterEggFound(eggId);
		if (!response)
			return;

		if (useGameStatsStore.getState().gameStatsVerboseMode)
			console.log("[gameStats > 'POST' easter-egg-found] response:", response);

		return response;
	} catch(error) {
		console.warn("[gameStats > 'POST' easter-egg-found] error:", error);

		return null;
	}
};