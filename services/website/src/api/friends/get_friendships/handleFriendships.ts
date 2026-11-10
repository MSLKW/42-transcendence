import { useFriendsStore } from "../../../store/FriendsStore";
import { fetchFriendships } from "./fetchFriendships";

export const handleFriendships = async (ownerUuid: string | null) => {
	if (!ownerUuid)
		return;

	try {
		const response = await fetchFriendships(ownerUuid);

		if (useFriendsStore.getState().friendsVerboseMode)
			console.log(`[friends > 'GET' friendships/${ownerUuid}] response:${response}`);

		return response;
	} catch (err) {
		const error = err instanceof Error ? err.message : "Something went wrong. Please try again";

		if (useFriendsStore.getState().friendsVerboseMode)
			console.warn(`[friends > 'GET' friendships/${ownerUuid}] error:${error}`);

		return null;
	}
}
