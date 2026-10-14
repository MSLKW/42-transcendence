import { NOTIFICATION_TYPE, useNotificationStore } from "../../../store/NotificationStore";
import { useProfileStore } from "../../../store/ProfileStore";
import { fetchGetSearch } from "./fetchGetSearch";

export const handleGetSearch = async (query: string, signal?: AbortSignal): Promise<string[]> => {
	try {
		const response = await fetchGetSearch(query, signal);

		if (useProfileStore.getState().profileVerboseMode)
			console.log(`[profile > 'GET' search/${query}] response:`, response);

		return response.searchResults;
	} catch (err) {
		const error = err instanceof Error ? err.message : "Something went wrong. Please try again";

		useNotificationStore.getState().showNotification(error, NOTIFICATION_TYPE.error);

		console.warn(`[profile > 'GET' search/${query}] error:${error}`);

		return [];
	}
}