import { fetchEasterEggFound } from "./fetchEasterEggFound";

export const handleEasterEggFound = async (eggId: string) => {
	try {
		const response = await fetchEasterEggFound(eggId);
		if (!response)
			return;

		return response;
	} catch(error) {
		console.warn("[stats > 'POST' easter-egg-found] error:", error);

		return null;
	}
};