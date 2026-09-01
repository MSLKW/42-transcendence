import { Socket } from "socket.io-client";
import { usePartyStore } from "../../../store/PartyStore";
import { useProfileStore } from "../../../store/ProfileStore";
import { chatSocket } from "../../chat/chatSocket";

export function partyStateHandler(socket: Socket) {
	socket.on("party_state", (partyData: { hostUuid: string; members: string[]; gameId: string | null }) => {
		if (partyData.members)
			usePartyStore.setState({ members: partyData.members });
		if (partyData.gameId)
			usePartyStore.setState({ partyGameId: partyData.gameId });
		if (partyData.hostUuid)
			usePartyStore.setState({ hostUuid: partyData.hostUuid });

		chatSocket.connect();
		chatSocket.joinRoom(partyData.hostUuid);

		useProfileStore.getState().setCachedData();

		console.log("[partySocket] 'party_state' partyData:", partyData);
	});
}