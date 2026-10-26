import { fetchDisplayedBadge } from "./fetchDisplayedBadge";

export const handleDisplayedBadge = async (badgeId: string) => {
	try {
		const response = await fetchDisplayedBadge(badgeId);
		if (!response)
			return;

		return response;
	} catch(error) {
		console.warn("[stats > 'POST' displayed-badge] error:", error);

		return null;
	}
};