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

		this.socket.on("party:update", (partyData: { totalMembers: number; gameMode: any; members: any[] }) => {
			const partyStore = usePartyStore.getState();
			partyStore.setPartyValue("totalMembers", partyData.totalMembers);
			partyStore.setPartyValue("gameMode", partyData.gameMode);
			partyStore.setPartyValue("members", partyData.members);
		});

		this.socket.on("disconnet", (reason) => {
			console.log("Disconnected from party microservice: ", reason);
		});
	}
	public disconnect() {
		if (this.socket) {
			this.socket.disconnect();
			this.socket = null;
		}
	}

	public invitePlayer(targetUuid: string) {
		if (!this.socket?.connected) {
			console.warn("Cannot invite player: Socket not connected");
			return;
		}

		this.socket.emit("party:invite", { targetUuid });
	}
	public kickMember(uuid: string) {
		this.socket?.emit("party:kick_member", { uuid });
	}
	public toggleAsFriend(uuid: string) {
		this.socket?.emit("party:add_friend_member", { uuid });
	}
	public updateGameMode(gameMode: number) {
		this.socket?.emit("party:set_gamemode", { gameMode });
	}
}

export const partySocket = new PartySocketService();