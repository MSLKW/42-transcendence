import { io, Socket } from "socket.io-client";
import { GameState } from "../game/GameState";
import { AIController } from "../ai/AIController";
import { GameStateData } from "../types";
import { logger } from "../utils/logger";

export class Bot {
	private state:	GameState;
	private ai:		AIController;
	private socket:	Socket | null = null;

	constructor(private id: string, private serverUrl: string) {
		this.state = new GameState();
		this.ai = new AIController(this.state);
	}

	start(): void {
		this.socket = io(this.serverUrl, { auth: { token: String(this.id) } });

		this.socket.on("connect", () => logger.info(this.id, "connected"));
		this.socket.on("disconnect", (reason: string) => logger.warn(this.id, "disconnected:", reason));

		this.socket.on("gameState", (data: GameStateData) => {
			try {
				this.state.update(data);
			} catch (err) {
				logger.error(this.id, "state update failed:", err);
			}
		});

		this.socket.on("yourTurn", () => {
			try {
				const action = this.ai.decide();
				this.socket?.emit("action", action);
			} catch (err) {
				logger.error(this.id, "AI decide failed:", err);
			}
		});
	}

	stop(): void {
		this.socket?.disconnect();
	}
}
