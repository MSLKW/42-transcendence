import { Socket } from "socket.io-client";
import { useAuthStore } from "../../../store/AuthStore";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";
import { useChatStore } from "../../../store/ChatStore";
import { useGameStatsStore } from "../../../store/GameStatsStore";
import { usePartyStore } from "../../../store/PartyStore";
import { useProfileStore } from "../../../store/ProfileStore";
import { chatSocket } from "../../chat/chatSocket";

export function partyStateHandler(socket: Socket) {
	socket.on("party_state", async (partyData: {
		hostUuid: string;
		members: string[];
		gameId: string | null
	}) => {
		if (usePartyStore.getState().partyVerboseMode)
			console.log("[party > 'on' party_state] partyData:", partyData);

		const clientUuid = useAuthStore.getState().clientUuid;
		/** Notify only when this update represents a host change that promotes the current client */
		const isClientNewHost = 
			usePartyStore.getState().hostUuid !== partyData.hostUuid &&
			clientUuid === partyData.hostUuid &&
			partyData.members.length > 1;

		usePartyStore.setState({
			members: partyData.members,
			hostUuid: partyData.hostUuid,
			partyGameId: partyData.gameId,
		});

		const currentChatRoomId = useChatStore.getState().chatRoomId;
		const newChatRoomId = partyData.hostUuid;
		if (currentChatRoomId !== newChatRoomId) {
			/** Party chat is keyed by its host, so changing hosts starts a fresh local transcript */
			useChatStore.setState ({
				chatRoomId: newChatRoomId,
				chatPlayerCount: null,
				chatLog: [],
			})
		}
		chatSocket.joinRoom(newChatRoomId);

		/** Refresh member metadata together after the authoritative roster changes */
		await Promise.all([
			useProfileStore.getState().setCachedProfile(),
			useGameStatsStore.getState().setCachedStats(),
			useAuthStore.getState().setCachedCreatedAts(),
		]);

		if (isClientNewHost)
			useNotificationStore.getState().showNotification("You are the host of this party", NOTIFICATION_TYPE.message);
	});
}
