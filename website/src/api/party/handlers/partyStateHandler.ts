import { Socket } from "socket.io-client";
import { chatSocket } from "../../chat/chatSocket";
import { useAuthStore } from "../../../store/AuthStore";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";
import { usePartyStore } from "../../../store/PartyStore";
import { useProfileStore } from "../../../store/ProfileStore";
import { joinGameLobby } from "../../game/src/main";

export function partyStateHandler(socket: Socket) {
	socket.on("party_state", async (partyData: { hostUuid: string; members: string[]; gameId: string | null }) => {
		console.log("[partySocket] 'party_state' partyData:", partyData);
		const hostUuid = usePartyStore.getState().hostUuid;
		const clientUuid = useAuthStore.getState().clientUuid;
		const partyGameId = usePartyStore.getState().partyGameId;

		if (hostUuid != partyData.hostUuid && clientUuid === partyData.hostUuid && partyData.members.length > 1) {
			const showNotification = useNotificationStore.getState().showNotification;
			showNotification("You are the host of this party", NOTIFICATION_TYPE.message);
		}

		const previousGameId = usePartyStore.getState().partyGameId;
		usePartyStore.setState({
			members: partyData.members,
			hostUuid: partyData.hostUuid,
			partyGameId: partyData.gameId,
		});

		if (partyData.gameId && partyData.gameId !== previousGameId && clientUuid)
			joinGameLobby(partyData.gameId, clientUuid);
		else {
			console.log("Blocked from joining game lobby:")
			console.log(`partyData.gameId: ${partyData.gameId}`);
			console.log(`partyGameId: ${partyGameId}`);
			console.log(`clientUuid: ${clientUuid}`);
		}

		await useProfileStore.getState().setCachedData();

		chatSocket.connect();
	});
}