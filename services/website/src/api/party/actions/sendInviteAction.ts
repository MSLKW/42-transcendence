import { Socket } from "socket.io-client";
import { ensureConnected } from "../../../utilities/websockets/ensureConnected";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";
import { usePartyStore } from "../../../store/PartyStore";
import type { SendInviteResponse } from "../partySocket";

function emitSendInvite(socket: Socket, recipientUuid: string): Promise<SendInviteResponse> {
	return new Promise((resolve) => {
		socket.emit(
			"send_invite",
			{ recipientUuid },
			(response: SendInviteResponse) => { resolve(response) }
		);
	});
}

export async function sendInviteAction(socket: Socket | null, recipientUuid: string, recipientName: string) {
	const showNotification = useNotificationStore.getState().showNotification;
	const setAvailability = usePartyStore.getState().setAvailability;
	const availabilityOverrides = usePartyStore.getState().availabilityOverrides;

	if (!socket)
		return;

	try {
		await ensureConnected(socket);

		const response = await emitSendInvite(socket, recipientUuid);
		if (!response.success) {
			showNotification(
				"Cannot invite player: Player is offline",
				NOTIFICATION_TYPE.error
			);

			setAvailability(recipientUuid, "Offline");

			console.warn("[party > 'emit' send_invite] reason:Failed to invite player");
			return;
		}

		if (!availabilityOverrides[recipientUuid] || availabilityOverrides[recipientUuid] === "Offline")
			setAvailability(recipientUuid, "Online");

		showNotification(
			`Invitation sent to ${recipientName}`,
			NOTIFICATION_TYPE.message
		);

		if (usePartyStore.getState().partyVerboseMode)
			console.log("[party > 'emit' send_invite] recipientUuid:", recipientUuid, " recipientName:", recipientName);
	} catch (error) {
		showNotification(
			"Unable to connect to party socket",
			NOTIFICATION_TYPE.error
		);

		console.warn("[party > 'emit' send_invite] error:", error);
	}
}