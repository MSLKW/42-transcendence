import { useGameStatsStore } from "../../../store/GameStatsStore";
import { fetchDisplayedBadge } from "./fetchDisplayedBadge";

export const handleDisplayedBadge = async (badgeId: string) => {
	try {
		const response = await fetchDisplayedBadge(badgeId);
		if (!response)
			return;

		if (useGameStatsStore.getState().gameStatsVerboseMode)
			console.log("[gameStats > 'PUT' displayed-badge] response:", response);

		return response;
	} catch(error) {
		console.warn("[gameStats > 'POST' displayed-badge] error:", error);

		return null;
	}
};