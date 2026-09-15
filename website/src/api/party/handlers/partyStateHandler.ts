import { Socket } from "socket.io-client";
import { usePartyStore } from "../../../store/PartyStore";
import { useProfileStore } from "../../../store/ProfileStore";
import { chatSocket } from "../../chat/chatSocket";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";

export function partyStateHandler(socket: Socket) {
	socket.on("party_state", async (partyData: { hostUuid: string; members: string[]; gameId: string | null }) => {
		const hostUuid = usePartyStore.getState().hostUuid;
		const clientUuid = useProfileStore.getState().clientUuid;
		console.log("hostUuid:", hostUuid, " clientUuid:", clientUuid, " partyData.hostUuid:", partyData.hostUuid);
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

		await useProfileStore.getState().setCachedData();

		usePartyStore.setState({
			partyStateResponse: {
				hostUuid: partyData.hostUuid,
				members: partyData.members,
				gameId: partyData.gameId,
			},
		});
		
		chatSocket.connect();
		chatSocket.joinRoom(partyData.hostUuid);

		console.log("[partySocket] 'party_state' partyData:", partyData);
	});
}