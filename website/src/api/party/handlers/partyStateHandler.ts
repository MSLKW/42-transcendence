import { Socket } from "socket.io-client";
import { usePartyStore } from "../../../store/PartyStore";
import { useProfileStore } from "../../../store/ProfileStore";
import { joinGameLobby } from "../../game/src/main";

export function partyStateHandler(socket: Socket) {
	socket.on("party_state", (partyData: { hostUuid: string; members: string[]; gameId: string | null }) => {
		usePartyStore.setState({ members: partyData.members });
		usePartyStore.setState({ partyGameId: partyData.gameId });
		usePartyStore.setState({ hostUuid: partyData.hostUuid });
		useProfileStore.getState().setCachedData();
		console.log("[partySocket] 'party_state' partyData:", partyData);

		const clientUuid = useProfileStore.getState().clientUuid;
		if (clientUuid === null) {
			console.log("[partySocket] 'game_session_start' clientUuid is missing");
			return ;
		}
		else if (partyData.gameId === null) {
			return ;
		}
		console.log("[partySocket] 'game_session_start' gameId:", partyData.gameId);
		joinGameLobby(partyData.gameId, clientUuid);
	});
}