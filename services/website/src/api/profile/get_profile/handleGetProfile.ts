import { useProfileStore, type UserData } from "../../../store/ProfileStore";
import { fetchGetProfile } from "./fetchGetProfile";

export const handleGetProfile = async (uuid: string): Promise<UserData | null> => {
	try {
		const response = await fetchGetProfile(uuid);

		if (useProfileStore.getState().profileVerboseMode)
			console.log(`[profile > 'GET' profile/${uuid}] response:`, response);

		return response;
	} catch (err) {
		const error = err instanceof Error ? err.message : "Something went wrong. Please try again";

		console.warn(`[profile > 'GET' profile/${uuid}] error:${error}`);

		return null;
	}
}