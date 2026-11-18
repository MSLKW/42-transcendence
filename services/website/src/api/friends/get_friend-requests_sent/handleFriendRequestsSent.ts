import { useFriendsStore } from "../../../store/FriendsStore";
import { fetchFriendRequestsSent } from "./fetchFriendRequestsSent";

export const handleFriendRequestsSent = async (senderUuid: string | null) => {
	if (!senderUuid)
		return;

	try {
		const response = await fetchFriendRequestsSent(senderUuid);

		if (useFriendsStore.getState().friendsVerboseMode)
			console.log(`[friends > 'GET' friend-requests/sent/${senderUuid}] response:${response}`);

		return response;
	} catch (err) {
		const error = err instanceof Error ? err.message : "Something went wrong. Please try again";

		if (useFriendsStore.getState().friendsVerboseMode)
			console.warn(`[friends > 'GET' friend-requests/sent/${senderUuid}] error:${error}`);

		return null;
	}
}
