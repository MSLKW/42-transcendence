import { Socket } from "socket.io-client";
import { useAuthStore } from "../../../store/AuthStore";
import { useChatStore } from "../../../store/ChatStore";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";
import { useGameStatsStore } from "../../../store/GameStatsStore";
import { usePartyStore } from "../../../store/PartyStore";
import { useProfileStore } from "../../../store/ProfileStore";

export function kickedHandler(socket: Socket) {
	socket.on("kicked", async (payload: {message: string}) => {
		await Promise.all([
			useProfileStore.getState().setCachedProfile(),
			useGameStatsStore.getState().setCachedStats(),
			useAuthStore.getState().setCachedCreatedAts(),
		]);

		const clientUuid = useAuthStore.getState().clientUuid!;
		usePartyStore.setState({
			hostUuid: clientUuid,
			members: [ clientUuid ],
		});

		useNotificationStore.getState().showNotification(
			"You've been kicked from the party",
			NOTIFICATION_TYPE.message
		)

		useChatStore.getState().addToCachedChat(
			"REPORT",
			"server",
			"",
			"",
			"You've been kicked from the party chat"
		);

		if (usePartyStore.getState().partyVerboseMode)
			console.log("[party > 'on' kicked] message:", payload.message);
	});
}