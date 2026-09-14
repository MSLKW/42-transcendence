import { Socket } from "socket.io-client";
import { usePartyStore } from "../../../store/PartyStore";
import { useProfileStore } from "../../../store/ProfileStore";
import { chatSocket } from "../../chat/chatSocket";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";

export function partyStateHandler(socket: Socket) {
	socket.on("party_state", (partyData: { hostUuid: string; members: string[]; gameId: string | null }) => {
		if (partyData.members)
			usePartyStore.setState({ members: partyData.members });
		if (partyData.gameId)
			usePartyStore.setState({ partyGameId: partyData.gameId });
		if (partyData.hostUuid)
			usePartyStore.setState({ hostUuid: partyData.hostUuid });

		const set_party = new Set(partyData.members);
		const set_cached = new Set(
			useProfileStore.getState().cachedData
			.map(item => item.uuid)
			.filter((uuid): uuid is string => uuid !== null)
		);
		if (set_party != set_cached) {
			for (const item of set_party) {
				if (!set_cached.has(item)) {
					useNotificationStore.getState().showNotification(
						`${item} has joined your party`,
						NOTIFICATION_TYPE.message
					)
				}
			}
			for (const item of set_cached) {
				if (!set_party.has(item)) {
					useNotificationStore.getState().showNotification(
						`${item} has left your party`,
						NOTIFICATION_TYPE.message
					)
				}
			}
			useProfileStore.getState().setCachedData();
		}

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