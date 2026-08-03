import { io, Socket } from "socket.io-client";
import { useGameStore } from "../store/GameStore";
import { useProfileStore } from "../store/ProfileStore";

class GameSocketService {
	private socket: Socket | null = null;

	public connect() {
		if (this.socket?.connected)
			return;

		this.socket = io({
			path: "/socket/game",
			transports: ["websocket", "polling"],
		});

		this.socket.on("connect", () => {
			console.log("Connected to Game Microservice:", this.socket?.id);
			const data = useProfileStore.getState().data;
			if (data.uuid) {
				this.socket?.emit("game:join", { data });
			}
		});
		this.socket.on("disconnect", (reason) => {
			console.log("Disconnected from Game Microservice: ", reason);
		});

		this.socket.on("game:state_update", (gameState) => {
			const gameStore = useGameStore.getState();
			// gameStore.setGameValue("activeProfile", gameState.activeProfile);
		});
	}
	public disconnect() {
		if (this.socket) {
			this.socket.disconnect();
			this.socket = null;
		}
	}

	public makeMove(moveData: any) {
		if (!this.socket?.connected) {
			console.warn("Cannot send move: Game socket not connected");
			return;
		}
		this.socket.emit("game:action", moveData);
	}
}

export const gameSocket = new GameSocketService();