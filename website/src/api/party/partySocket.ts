import { io, Socket } from "socket.io-client";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../store/NotificationStore";
import { usePartyStore } from "../../store/PartyStore";

class PartySocketService {
	private socket: Socket | null = null;
	private isConnecting: boolean = false;

	public connect() {
		if (this.socket?.connected || this.isConnecting)
			return;
		this.isConnecting = true;

		this.socket = io({
			path: "/socket/party",
			transports: ["websocket", "polling"],
		});
		
		this.socket.on("connect", () => {
			this.isConnecting = false;
			
			usePartyStore.getState().setPartySocketId(this.socket?.id);
			console.log("[partySocket] \'connect\' id:", this.socket?.id);

			const { showNotification } = useNotificationStore.getState();
			showNotification(
				`Connected to Party Manager: ${this.socket?.id}`,
				NOTIFICATION_TYPE.message
			)
		});

		this.socket.on("party_state", (partyData: { hostUuid: string; members: string[]; gameId: string | null }) => {
			console.log("[partySocket] 'party_state' partyData:", partyData);
			
			usePartyStore.getState().setPartyData(partyData.members);
			usePartyStore.getState().setPartyValue("partyGameId", partyData.gameId);
			usePartyStore.getState().setPartyValue("hostUuid", partyData.hostUuid);

			const { showNotification } = useNotificationStore.getState();
			showNotification(
				`Party state: ${partyData.hostUuid} | ${partyData.gameId}`,
				NOTIFICATION_TYPE.message
			)
		});

		this.socket.on("invite_received", (payload: { hostUuid: string, hostName?: string }) => {
			console.log("[partySocket] invite_received");
			const { showNotification } = useNotificationStore.getState();
			showNotification(
				`${payload.hostName || "A player"} invited you to their party!`,
				NOTIFICATION_TYPE.invite,
				() => partySocket.acceptInvite(payload.hostUuid),
				() => partySocket.rejectInvite(payload.hostUuid)
			)
		});

		this.socket.on("kicked", (payload: {message: string}) => {
			console.log(payload);
			const { showNotification } = useNotificationStore.getState();
			showNotification(
				`Party disbanded: ${payload.message}`,
				NOTIFICATION_TYPE.message
			)
		});

		this.socket.on("game_session_start", (payload: {gameId: string}) => {
			console.log(payload);
			const { showNotification } = useNotificationStore.getState();
			showNotification(
				`Game session start: ${payload.gameId}`,
				NOTIFICATION_TYPE.message
			)
		});

		this.socket.on("disconnect", (reason) => {
			this.isConnecting = false;

			usePartyStore.getState().setPartySocketId("n/a");
			console.log("Disconnected from Party Manager: ", reason);

			const { showNotification } = useNotificationStore.getState();
			showNotification(
				`Disconnected from party microservice: ${reason}`,
				NOTIFICATION_TYPE.error
			)
		});

		this.socket.on("connect_error", (error) => {
			this.isConnecting = false;
			console.log("Connection error:", error.message);
			const { showNotification } = useNotificationStore.getState();
			showNotification(
				`Connection error: ${error.message}`,
				NOTIFICATION_TYPE.error
			)
		});
	}
	public disconnect() {
		this.isConnecting = false;
		if (this.socket) {
			this.socket.disconnect();
			this.socket = null;
		}
	}

	public sendInvite(recipientUuid: string, recipientName?: string) {
		const { showNotification } = useNotificationStore.getState();
		if (!this.socket?.connected) {
			showNotification(
				"Cannot invite player: Socket not connected",
				NOTIFICATION_TYPE.error
			);
			return;
		}

		this.socket.emit("send_invite", { recipientUuid });
		showNotification(
			`Invitation sent to ${recipientName}`,
			NOTIFICATION_TYPE.message
		);
	}
	public kickMember(recipientUuid: string, recipientName: string) {
		const { showNotification } = useNotificationStore.getState();
		if (!this.socket?.connected) {
			showNotification(
				"Cannot kick member: Socket not connected",
				NOTIFICATION_TYPE.error
			);
			return;
		}
		
		this.socket?.emit("kick_player", { recipientUuid });
		showNotification(
			`${recipientName} removed from your party`,
			NOTIFICATION_TYPE.message
		);
	}
	public startGameSession() {
		const { showNotification } = useNotificationStore.getState();
		if (!this.socket?.connected) {
			showNotification(
				"Cannot start game session: Socket not connected",
				NOTIFICATION_TYPE.error
			);
			return;
		}

		this.socket?.emit("start_game_session");
		showNotification(
			"Game session started",
			NOTIFICATION_TYPE.message
		);
	}
	public acceptInvite(hostUuid: string) {
		const { showNotification } = useNotificationStore.getState();
		if (!this.socket?.connected) {
			showNotification(
				"Cannot accept invite: Socket not connected",
				NOTIFICATION_TYPE.error
			);
			return;
		}

		this.socket?.emit("accept_invite", { hostUuid }, (response: any) => {
			if (!response.success)
				console.log("Failed to accept:", response.reason);
		});
		showNotification(
			"You just joined a party!",
			NOTIFICATION_TYPE.message
		);
	}
	public rejectInvite(hostUuid: string) {
		const { showNotification } = useNotificationStore.getState();
		if (!this.socket?.connected) {
			showNotification(
				"Cannot reject invite: Socket not connected",
				NOTIFICATION_TYPE.error
			);
			return;
		}

		this.socket?.emit("reject_invite", { hostUuid });
		showNotification(
			"Invitation rejected",
			NOTIFICATION_TYPE.message
		);
	}
	public leaveParty() {
		const { showNotification } = useNotificationStore.getState();
		if (!this.socket?.connected) {
			showNotification(
				"Cannot leave party: Socket not connected",
				NOTIFICATION_TYPE.error
			);
			return;
		}

		this.socket?.emit("leave_party");
		showNotification(
			"You left the party",
			NOTIFICATION_TYPE.message
		);
	}
	public updateGameMode(gameMode: number) {
		const { showNotification } = useNotificationStore.getState();
		if (!this.socket?.connected) {
			showNotification(
				"Cannot update game mode: Socket not connected",
				NOTIFICATION_TYPE.error
			);
			return;
		}

		this.socket?.emit("party:set_gamemode", { gameMode });
		showNotification(
			"Game mode updated",
			NOTIFICATION_TYPE.message
		);
	}
	public isSocketActive(): boolean {
		return !!(this.socket && this.socket.connected && this.socket.id) || this.isConnecting;
	}
}

export const partySocket = new PartySocketService();