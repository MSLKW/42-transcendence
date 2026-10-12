import { NOTIFICATION_TYPE, useNotificationStore } from "../../../store/NotificationStore";
import { fetchGetSearch } from "./fetchGetSearch";

export const handleGetSearch = async (query: string, signal?: AbortSignal): Promise<string[]> => {
	const { showNotification } = useNotificationStore.getState();

	try {
		const response = await fetchGetSearch(query, signal);
		console.log("[handleGetSearch] response:", response);
		return response.searchResults;
	} catch (err) {
		if (err instanceof DOMException && err.name === "AbortError")
			return [];

		const errorMsg = err instanceof Error ? err.message : "Something went wrong. Please try again";
		console.log("[handleGetSearch] errorMsg:", errorMsg);
		showNotification(errorMsg, NOTIFICATION_TYPE.error);
		return [];
	}
}