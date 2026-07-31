import { io, Socket } from "socket.io-client";
import { usePartyStore } from "../store/PartyStore";
import { usePlayerStore } from "../store/PlayerStore";

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

			const player = usePlayerStore.getState().data;
			if (player.uuid)
				this.socket?.emit("party:join", { player });
		});

		this.socket.on("party_state", (partyData: { host: string; member: string[]; gameId: string | null }) => {
			console.log(partyData);
		});

		this.socket.on("invite_received", (payload: {hostUuid: string}) => {
			console.log(payload);
		});

		this.socket.on("kicked", (payload: {message: string}) => {
			console.log(payload);
		});

		this.socket.on("game_session_start", (payload: {gameId: string}) => {
			console.log(payload);
		});

		this.socket.on("disconnect", (reason) => {
			console.log("Disconnected from party microservice: ", reason);
		});

		this.socket.on("connect_error", (error) => {
			console.log("Connection error:", error.message);
		});
	}
	public disconnect() {
		if (this.socket) {
			this.socket.disconnect();
			this.socket = null;
		}
	}

	public sendInvite(recipientUuid: string) {
		if (!this.socket?.connected) {
			console.warn("Cannot invite player: Socket not connected");
			return;
		}

		this.socket.emit("send_invite", { recipientUuid });
	}
	public kickMember(recipientUuid: string) {
		this.socket?.emit("kick_player", { recipientUuid });
	}
	public startGameSession() {
		this.socket?.emit("start_game_session");
	}
	public acceptInvite(hostUuid: string) {
		this.socket?.emit("accept_invite", { hostUuid }, (response: any) => {
			if (!response.success)
				console.log("Failed to accept:", response.reason);
		});
	}
	public rejectInvite(hostUuid: string) {
		this.socket?.emit("reject_invite", { hostUuid });
	}
	public leaveParty() {
		this.socket?.emit("leave_party");
	}
	public updateGameMode(gameMode: number) {
		this.socket?.emit("party:set_gamemode", { gameMode });
	}

}

export const partySocket = new PartySocketService();