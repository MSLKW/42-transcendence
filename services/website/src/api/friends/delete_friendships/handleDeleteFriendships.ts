import { useFriendsStore } from "../../../store/FriendsStore";
import { fetchDeleteFriendships } from "./fetchDeleteFriendships";

export const handleDeleteFriendships = async (ownerUuid: string | null, friendUuid: string | null) => {
	if (!ownerUuid || !friendUuid) {
		console.warn(`[friends > 'DELETE' friendships/${ownerUuid}/${friendUuid}] missing ownerUuid / friendUuid`);
		return;
	}

	try {
		const response = await fetchDeleteFriendships(ownerUuid, friendUuid);

		if (useFriendsStore.getState().friendsVerboseMode)
			console.log(`[friends > 'DELETE' friendships/${ownerUuid}/${friendUuid}] response:${response}`);

		return response;
	} catch (err) {
		const error = err instanceof Error ? err.message : "Something went wrong. Please try again";

		console.warn(`[friends > 'DELETE' friendships/${ownerUuid}/${friendUuid}] error:${error}`);

		return null;
	}
}
