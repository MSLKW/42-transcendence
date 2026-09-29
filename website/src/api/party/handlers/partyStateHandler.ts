import { Socket } from "socket.io-client";
import { useAuthStore } from "../../../store/AuthStore";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";
import { usePartyStore } from "../../../store/PartyStore";
import { useProfileStore } from "../../../store/ProfileStore";
import { joinGameLobby } from "../../game/src/main";

export function partyStateHandler(socket: Socket) {
	socket.on("party_state", async (partyData: { hostUuid: string; members: string[]; gameId: string | null }) => {
		const clientUuid = useAuthStore.getState().clientUuid;
		const previousGameId = usePartyStore.getState().partyGameId;
		const isClientNewHost = usePartyStore.getState().hostUuid !== partyData.hostUuid && clientUuid === partyData.hostUuid && partyData.members.length > 1;

		usePartyStore.setState({
			members: partyData.members,
			hostUuid: partyData.hostUuid,
			partyGameId: partyData.gameId,
		});
		if (partyData.gameId && partyData.gameId !== previousGameId && clientUuid)
			joinGameLobby(partyData.gameId, clientUuid);
		// else {
		// 	console.log("Blocked from joining game lobby:")
		// 	console.log(`partyData.gameId: ${partyData.gameId}`);
		// 	console.log(`partyGameId: ${partyGameId}`);
		// 	console.log(`clientUuid: ${clientUuid}`);
		// }

		await useProfileStore.getState().setCachedData();

		if (isClientNewHost)
			useNotificationStore.getState().showNotification("You are the new host of this party", NOTIFICATION_TYPE.message);

		if (usePartyStore.getState().partyVerboseMode)
			console.log("[party > 'on' party_state] partyData:", partyData);
	});
}