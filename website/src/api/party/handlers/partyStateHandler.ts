import { Socket } from "socket.io-client";
import { usePartyStore } from "../../../store/PartyStore";
import { useProfileStore } from "../../../store/ProfileStore";

export function partyStateHandler(socket: Socket) {
	socket.on("party_state", (partyData: { hostUuid: string; members: string[]; gameId: string | null }) => {
		usePartyStore.setState({ members: partyData.members });
		usePartyStore.setState({ partyGameId: partyData.gameId });
		usePartyStore.setState({ hostUuid: partyData.hostUuid });
		useProfileStore.getState().setCachedData();
		console.log("[partySocket] 'party_state' partyData:", partyData);
	});
}