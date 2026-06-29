import { io, Socket } from "socket.io-client";
import { GameState } from "../game/GameState";
import { AIController } from "../ai/AIController";
import { CardHandTransmit, GameStateTransmit } from "../Types";
import { logger } from "../utils/logger";

type CardHand = CardHandTransmit;

export class Bot {
	private state:	GameState;
	private ai:		AIController;
	private socket:	Socket | null = null;

	constructor(private id: string, private serverUrl: string) {
		this.state = new GameState();
		this.ai = new AIController();
	}

	start(): void
	{
		this.socket = io(this.serverUrl, { auth: { token: String(this.id) } });

		this.socket.on("connect", () => logger.info(this.id, "connected"));
		this.socket.on("disconnect", this.disconnect);
		this.socket.on("player_game_state", this.initGameState);
		this.socket.on("player_turn", this.playCardHand);
		this.socket.on("opponent_play_card_hand", this.checkOpponentMove);
		
	}
	
	private initGameState = (gameStateJSON: string) =>
	{
		const gameTransmit = JSON.parse(gameStateJSON) as GameStateTransmit;

		this.state.initPlayerCards(gameTransmit.playerCards);
		logger.info(this.id, this.state.playerCards);
		if (gameTransmit.isPlayerTurn)
			this.playCardHand();
	}

	private playCardHand = () =>
	{
		const cardHand: CardHand | null = this.ai.decide(this.id, this.state);

		if (cardHand == null)
		{
			logger.info(this.id, "skipping turn");
			this.socket?.emit("player_skip_turn");
		}
		else
		{
			cardHand.playerId = this.id;
			logger.info(this.id, "attempting to play", cardHand);
			this.socket?.emit("player_play_card_hand", JSON.stringify(cardHand));
			this.state.setLastMove(cardHand);
			this.state.removeCards(cardHand);
		}
	}
	
	private checkOpponentMove = (cardHandJSON: string) =>
	{
		const opponentMove = JSON.parse(cardHandJSON) as CardHandTransmit;
		if (opponentMove.playerId != this.id)
		{
			logger.info(this.id, "opponent played:", opponentMove);
			this.state.setLastMove(opponentMove);
		}
	}
	
	private disconnect = (reason: string) =>
	{
		logger.warn(this.id, "disconnected:", reason);
		this.socket?.disconnect();
		this.socket = null;
	}

	stop(): void
	{
		this.socket?.disconnect();
		this.socket = null;
	}
}
