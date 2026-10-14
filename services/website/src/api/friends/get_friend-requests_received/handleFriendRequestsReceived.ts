import { useFriendsStore } from "../../../store/FriendsStore";
import { fetchFriendRequestsReceived } from "./fetchFriendRequestsReceived";

export const handleFriendRequestsReceived = async (receiverUuid: string) => {
	try {
		const response = await fetchFriendRequestsReceived(receiverUuid);

		if (useFriendsStore.getState().friendsVerboseMode)
			console.log(`[friends > 'GET' friend-requests/received/${receiverUuid}] response:${response}`);

		return response;
	} catch (err) {
		const error = err instanceof Error ? err.message : "Something went wrong. Please try again";

		console.warn(`[friends > 'GET' friend-requests/received/${receiverUuid}] error:${error}`);

		return null;
	}
}
