import { io, Socket } from "socket.io-client";
import { GameState } from "../game/GameState";
import { AAIController } from "../ai/AAIController";
import { GameStateTransmit, CardHandTransmit, PlayerSeatOrderTransmit,
		StatusTransmit, PlayerTurnTransmit, GameStartRequest,
		GameEndStatsTransmit } from "../Types";
import { logger } from "../utils/logger";

type CardHand = CardHandTransmit;

export class Bot
{
	private state:			GameState;
	private ai:				AAIController;
	private socket:			Socket | null = null;
	private wins:			number = 0;
	private gamesPlayed:	number = 0;
	private maxGames:		number = 1000;

	constructor(private id: string, private serverUrl: string, ai: AAIController)
	{
		this.state = new GameState();
		this.ai = ai;
	}

	start(): void
	{
		this.socket = io(this.serverUrl, { auth: { token: String(this.id) } });

		this.socket.on("connect", () => logger.info(this.id, "connected"));
		this.socket.on("disconnect", this.disconnect);
		this.socket.on("player_join", this.playerJoined);
		this.socket.on("player_game_state", this.initGameState);
		this.socket.on("player_turn", this.checkTurn);
		this.socket.on("player_play_card_hand", this.checkSuccess);
		this.socket.on("opponent_play_card_hand", this.checkOpponentMove);
		this.socket.on("game_end", this.gameEnd);
	}

	private	playerJoined = (seatOrder: PlayerSeatOrderTransmit) =>
	{
		if (seatOrder.seatOrder[this.id] == 3)
		{	
			const startRequest: GameStartRequest = {
				playerId: this.id
			}
			this.socket?.emit("game_start", startRequest);
		}
	}

	private initGameState = (gameState: GameStateTransmit) =>
	{
		this.state.initPlayerCards(gameState.playerCards);
		logger.info(this.id, this.state.playerCards);
	}
	
	private checkTurn = (playerTurn: PlayerTurnTransmit) =>
	{
		if (playerTurn.playerId == this.id)
			this.playCardHand();
		else
			logger.info(this.id, "Player<" + playerTurn.playerId + ">'s turn");
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
			this.state.setLastMove(cardHand);
			this.state.removeCards(cardHand);
			logger.info(this.id, "attempting to play", cardHand);
			this.socket?.emit("player_play_card_hand", cardHand);
		}
	}

	private checkSuccess = (stat: StatusTransmit) =>
	{
		if (!stat.success)
			logger.error(this.id, "Error:", stat.message);
	}
	
	private checkOpponentMove = (opponentMove: CardHand) =>
	{
		if (opponentMove.playerId != this.id)
		{
			logger.info(this.id, "opponent played:", opponentMove);
			this.state.setLastMove(opponentMove);
		}
	}

	private	gameEnd = (stat: GameEndStatsTransmit) =>
	{
		this.gamesPlayed++;
		if (stat.winnerPlayerId == this.id)
		{
			logger.info(this.id, "I won");
			this.wins++;
			if (this.gamesPlayed != this.maxGames)
			{
				const startRequest: GameStartRequest = {
					playerId: this.id
				};
				this.socket?.emit("game_start", startRequest);
			}
		}
		else
		{
			logger.info(this.id, "I lost");
		}
		if (this.gamesPlayed == this.maxGames)
			logger.warn(this.id, "I won", this.wins, "times");
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
