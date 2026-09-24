import { Socket } from "socket.io-client";
import { ensureConnected } from "../../../utilities/websockets/ensureConnected";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";
import { usePartyStore } from "../../../store/PartyStore";

export async function sendInviteAction(socket: Socket | null, recipientUuid: string, recipientName?: string) {
	const showNotification = useNotificationStore.getState().showNotification;
	const setAvailability = usePartyStore.getState().setAvailability;
	const availabilityOverrides = usePartyStore.getState().availabilityOverrides;

	if (!socket)
		return;

	try {
		await ensureConnected(socket);

		socket.emit("send_invite", { recipientUuid }, (response: any) => {
			if (!response.success) {
				console.log("Failed to send invite:", response.reason);
				showNotification(
					"Cannot invite player: Player is offline",
					NOTIFICATION_TYPE.error
				);
				setAvailability(recipientUuid, "Offline");
				return;
			}

			if (!availabilityOverrides[recipientUuid] || availabilityOverrides[recipientUuid] === "Offline")
				setAvailability(recipientUuid, "Online");

			showNotification(
				`Invitation sent to ${recipientName}`,
				NOTIFICATION_TYPE.message
			);
		});
	} catch (error) {
		showNotification(
			"Unable to connect to party server",
			NOTIFICATION_TYPE.error
		);
		console.error("Unable to connect to party socket:", error);
	}
}