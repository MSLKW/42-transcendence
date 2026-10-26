import { usePartyStore } from "../../../store/PartyStore";
import { fetchGetOnline } from "./fetchGetOnline";

interface OnlineData {
	isOnline: boolean;
	inParty: boolean;
	lastOnline: Date | null;
}

export const handleGetOnline = async (uuid: string): Promise<OnlineData | null> => {
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
