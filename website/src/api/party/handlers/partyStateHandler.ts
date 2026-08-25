import { Socket } from "socket.io-client";
import { usePartyStore } from "../../../store/PartyStore";

export function partyStateHandler(socket: Socket) {
	socket.on("party_state", (partyData: { hostUuid: string; members: string[]; gameId: string | null }) => {
		usePartyStore.getState().setPartyData(partyData.members);
		usePartyStore.getState().setPartyValue("partyGameId", partyData.gameId);
		usePartyStore.getState().setPartyValue("hostUuid", partyData.hostUuid);
		console.log("[partySocket] 'party_state' partyData:", partyData);
	});
}