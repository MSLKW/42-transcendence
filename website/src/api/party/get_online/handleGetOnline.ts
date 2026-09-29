import { usePartyStore } from "../../../store/PartyStore";
import { fetchGetOnline } from "./fetchGetOnline";

export const handleGetOnline = async (uuid: string) => {
	try {
		const response = await fetchGetOnline(uuid);

		if (usePartyStore.getState().partyVerboseMode)
			console.log(`[party > 'GET' online/${uuid}] response:`, response);

		return response;
	} catch (err) {
		const error = err instanceof Error ? err.message : "Something went wrong. Please try again";

		console.warn(`[party > 'GET' online/${uuid}] error:${error}`);

		return null;
	}
}
