import { Socket } from "socket.io-client";
import { chatSocket } from "../../chat/chatSocket";
import { useAuthStore } from "../../../store/AuthStore";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";
import { usePartyStore } from "../../../store/PartyStore";
import { useProfileStore } from "../../../store/ProfileStore";
import { joinGameLobby } from "../../game/src/main";
import { useSceneStore } from "../../../store/SceneStore";

export function partyStateHandler(socket: Socket) {
	socket.on("party_state", async (partyData: { hostUuid: string; members: string[]; gameId: string | null }) => {
		console.log("[partySocket] 'party_state' partyData:", partyData);
		const hostUuid = usePartyStore.getState().hostUuid;
		const clientUuid = useAuthStore.getState().clientUuid;
		const partyGameId = usePartyStore.getState().partyGameId;
		if (hostUuid != partyData.hostUuid && clientUuid === partyData.hostUuid && partyData.members.length > 1) {
			const showNotification = useNotificationStore.getState().showNotification;
			showNotification("You are the new host of this party", NOTIFICATION_TYPE.message);
		}

		if (partyData.members)
			usePartyStore.setState({ members: partyData.members });
		if (partyData.gameId)
			usePartyStore.setState({ partyGameId: partyData.gameId });
		if (partyData.hostUuid)
			usePartyStore.setState({ hostUuid: partyData.hostUuid });
		if (partyData.gameId && partyData.gameId !== partyGameId && clientUuid) {
			joinGameLobby(partyData.gameId, clientUuid);
		}
		else if (partyData.gameId === null) {
			useSceneStore.getState().setCurrentScene("Home");
		}
		console.log(`partyData.gameId: ${partyData.gameId}`);
		console.log(`partyGameId: ${partyGameId}`);
		console.log(`clientUuid: ${clientUuid}`);

		await useProfileStore.getState().setCachedData();

		chatSocket.connect();
		chatSocket.joinRoom(partyData.hostUuid);
	});
}