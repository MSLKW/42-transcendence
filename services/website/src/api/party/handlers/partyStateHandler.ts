import { Socket } from "socket.io-client";
import { useAuthStore } from "../../../store/AuthStore";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";
import { usePartyStore } from "../../../store/PartyStore";
import { useProfileStore } from "../../../store/ProfileStore";
import { useChatStore } from "../../../store/ChatStore";
import { useStatsStore } from "../../../store/StatsStore";
import { chatSocket } from "../../chat/chatSocket";

export function partyStateHandler(socket: Socket) {
	socket.on("party_state", async (partyData: { hostUuid: string; members: string[]; gameId: string | null }) => {
		if (usePartyStore.getState().partyVerboseMode)
			console.log("[party > 'on' party_state] partyData:", partyData);

		const clientUuid = useAuthStore.getState().clientUuid;
		const isClientNewHost = usePartyStore.getState().hostUuid !== partyData.hostUuid && clientUuid === partyData.hostUuid && partyData.members.length > 1;

		usePartyStore.setState({
			members: partyData.members,
			hostUuid: partyData.hostUuid,
			partyGameId: partyData.gameId,
		});

		chatSocket.joinRoom(partyData.hostUuid);
		useChatStore.setState({ chatRoomId: partyData.hostUuid });

		await useProfileStore.getState().setCachedProfile();
		await useStatsStore.getState().setCachedStats();

		if (isClientNewHost)
			useNotificationStore.getState().showNotification("You are the new host of this party", NOTIFICATION_TYPE.message);
	});
}