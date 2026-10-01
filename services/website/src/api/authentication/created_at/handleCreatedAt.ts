import { useAuthStore } from "../../../store/AuthStore";
import { fetchCreatedAt } from "./fetchCreatedAt";

export const handleCreatedAt = async (uuid: string) => {
	try {
		const response = await fetchCreatedAt(uuid);

		if (useAuthStore.getState().authVerboseMode)
			console.log("[authentication > 'GET' created-at] response:", response);

		return new Date(response.createdAt);
	} catch (err) {
		const error = err instanceof Error ? err.message : "Something went wrong. Please try again";

		console.warn("[authentication > 'GET' created-at] error:", error);

		return null;
	}
};