import { io, Socket } from "socket.io-client";
import { usePlayerStore } from "../store/PlayerStore";
import { useNotificationStore, notificationType } from "../store/NotificationStore";

class PartySocketService {
	private socket: Socket | null = null;

	public connect() {
		if (this.socket?.connected)
			return;

		this.socket = io({
			path: "/socket/party",
			transports: ["websocket", "polling"],
		});
		
		this.socket.on("connect", () => {
			console.log("Connected to Party Microservice:", this.socket?.id);
			const { showNotification } = useNotificationStore.getState();
			showNotification(
				`Connected to Party Microservice: ${this.socket?.id}`,
				notificationType.message
			)

			const player = usePlayerStore.getState().data;
			if (player.uuid)
				this.socket?.emit("party:join", { player });
		});

		this.socket.on("party_state", (partyData: { host: string; member: string[]; gameId: string | null }) => {
			console.log(partyData);
			const { showNotification } = useNotificationStore.getState();
			showNotification(
				`Party state: ${partyData.host} | ${partyData.gameId}`,
				notificationType.message
			)
		});

		this.socket.on("invite_received", (payload: { hostUuid: string, hostName?: string }) => {
			console.log(payload);
			const { showNotification } = useNotificationStore.getState();
			showNotification(
				`${payload.hostName || "A player"} invited you to their party!`,
				notificationType.invite,
				() => partySocket.acceptInvite(payload.hostUuid),
				() => partySocket.rejectInvite(payload.hostUuid)
			)
		});

		this.socket.on("kicked", (payload: {message: string}) => {
			console.log(payload);
			const { showNotification } = useNotificationStore.getState();
			showNotification(
				`Party disbanded: ${payload.message}`,
				notificationType.message
			)
		});

		this.socket.on("game_session_start", (payload: {gameId: string}) => {
			console.log(payload);
			const { showNotification } = useNotificationStore.getState();
			showNotification(
				`Game session start: ${payload.gameId}`,
				notificationType.message
			)
		});

		this.socket.on("disconnect", (reason) => {
			console.log("Disconnected from party microservice: ", reason);
			const { showNotification } = useNotificationStore.getState();
			showNotification(
				`Disconnected from party microservice: ${reason}`,
				notificationType.error
			)
		});

		this.socket.on("connect_error", (error) => {
			console.log("Connection error:", error.message);
			const { showNotification } = useNotificationStore.getState();
			showNotification(
				`Connection error: ${error.message}`,
				notificationType.error
			)
		});
	}
	public disconnect() {
		if (this.socket) {
			this.socket.disconnect();
			this.socket = null;
		}
	}

	public sendInvite(recipientUuid: string, recipientName: string) {
		const { showNotification } = useNotificationStore.getState();
		if (!this.socket?.connected) {
			showNotification(
				"Cannot invite player: Socket not connected",
				notificationType.error
			);
			return;
		}

		this.socket.emit("send_invite", { recipientUuid });
		showNotification(
			`Invitation sent to ${recipientName}`,
			notificationType.message
		);
	}
	public kickMember(recipientUuid: string, recipientName: string) {
		const { showNotification } = useNotificationStore.getState();
		if (!this.socket?.connected) {
			showNotification(
				"Cannot kick member: Socket not connected",
				notificationType.error
			);
			return;
		}
		
		this.socket?.emit("kick_player", { recipientUuid });
		showNotification(
			`${recipientName} removed from your party`,
			notificationType.message
		);
	}
	public startGameSession() {
		const { showNotification } = useNotificationStore.getState();
		if (!this.socket?.connected) {
			showNotification(
				"Cannot start game session: Socket not connected",
				notificationType.error
			);
			return;
		}

		this.socket?.emit("start_game_session");
		showNotification(
			"Game session started",
			notificationType.message
		);
	}
	public acceptInvite(hostUuid: string) {
		const { showNotification } = useNotificationStore.getState();
		if (!this.socket?.connected) {
			showNotification(
				"Cannot accept invite: Socket not connected",
				notificationType.error
			);
			return;
		}

		this.socket?.emit("accept_invite", { hostUuid }, (response: any) => {
			if (!response.success)
				console.log("Failed to accept:", response.reason);
		});
		showNotification(
			"You just joined a party!",
			notificationType.message
		);
	}
	public rejectInvite(hostUuid: string) {
		const { showNotification } = useNotificationStore.getState();
		if (!this.socket?.connected) {
			showNotification(
				"Cannot reject invite: Socket not connected",
				notificationType.error
			);
			return;
		}

		this.socket?.emit("reject_invite", { hostUuid });
		showNotification(
			"Invitation rejected",
			notificationType.message
		);
	}
	public leaveParty() {
		const { showNotification } = useNotificationStore.getState();
		if (!this.socket?.connected) {
			showNotification(
				"Cannot leave party: Socket not connected",
				notificationType.error
			);
			return;
		}

		this.socket?.emit("leave_party");
		showNotification(
			"You left the party",
			notificationType.message
		);
	}
	public updateGameMode(gameMode: number) {
		const { showNotification } = useNotificationStore.getState();
		if (!this.socket?.connected) {
			showNotification(
				"Cannot update game mode: Socket not connected",
				notificationType.error
			);
			return;
		}

		this.socket?.emit("party:set_gamemode", { gameMode });
		showNotification(
			"Game mode updated",
			notificationType.message
		);
	}
}

export const partySocket = new PartySocketService();