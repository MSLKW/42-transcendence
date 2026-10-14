import { useFriendsStore } from "../../../store/FriendsStore";
import { fetchGetEvents } from "./fetchGetEvents";

export const handleGetEvents = async () => {
	try {
		const response = await fetchGetEvents();

		if (useFriendsStore.getState().friendsVerboseMode)
			console.log(`[friends > 'GET' events] response:${response}`);

		return response;
	} catch (err) {
		const error = err instanceof Error ? err.message : "Something went wrong. Please try again";

		console.warn(`[friends > 'GET' events] error:${error}`);

		return null;
	}
}
