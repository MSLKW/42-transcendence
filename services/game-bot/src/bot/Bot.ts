import { io, Socket } from "socket.io-client";
import { GameState } from "../game/GameState.js";
import { AAIController } from "../ai/AAIController.js";
import { logger } from "../utils/logger.js";
import { writeFileSync } from "fs";
import { setTimeout } from "timers/promises";
import { StatusTransmit, GameStateTransmit, CardHandTransmit, PlayerTurnTransmit, GameEndStatsTransmit } from "@big2/game-types";

// import {
// 	GameStateTransmit,
// 	CardHandTransmit,
// 	PlayerSeatOrderTransmit,
// 	PlayerTurnTransmit,
// 	GameStartRequest,
// 	GameEndStatsTransmit
// } from "../Types";


type CardHand = CardHandTransmit;

const CONNECTION_ATTEMPT_DELAY_MS = 500;
const CONNECTION_RETRY_LIMIT = 10;
const CONNECTION_RETRY_DELAY_MS = 1000;

export class Bot
{
	private state:			GameState;
	private ai:				AAIController;
	private socket:			Socket | null = null;

	// private seatOrder:		PlayerSeatOrderTransmit | null = null;

	private wins:			number = 0;
	private gamesPlayed:	number = 0;
	private maxGames:		number = 1000;

	constructor(private id: string, private serverUrl: string, ai: AAIController)
	{
		this.state = new GameState("", {}, []);
		this.ai = ai;
	}

	async start(serverUrl: string, lobbyId: string, seat: number, sessionToken: string): Promise<boolean>
	{
		await setTimeout(CONNECTION_ATTEMPT_DELAY_MS);
		for (let attempt = 0; attempt < CONNECTION_RETRY_LIMIT && !this.socket?.connected; ++attempt)
		{
			
			logger.verbose(this.id, `connecting socket to ${serverUrl} (attempt ${attempt})`);
			this.socket = io(this.serverUrl, {
				auth: {
					lobbyId:			lobbyId,
					botSessionToken:	sessionToken
				}
			});
			this.socket?.on("graceful_disconnect", (reason: string) => console.log("kicked:", reason));
			if (!this.socket?.connected)
				await setTimeout(CONNECTION_RETRY_DELAY_MS * (attempt + 1));
		}
		if (!this.socket || !this.socket?.connected)
		{
			logger.error(this.id, `failed to socket to ${serverUrl}`);
			return false;
		}
		logger.info(this.id, `connected socket to ${serverUrl}`);

		const status: StatusTransmit = await this.socket.emitWithAck("user_seat_take", seat);
		if (!status.success)
		{
			logger.info(this.id, `failed to take seat ${seat}`);
			return false;
		}

		this.setupSocketEvents();
		return true;
	}
	
	stop(): void
	{
		this.socket?.disconnect();
		this.socket = null;
	}

	private setupSocketEvents()
	{
		if (this.socket == null)
			return ;
		this.socket.on("connect", () => logger.info(this.id, "connected"));
		this.socket.on("disconnect", this.disconnect);
		// this.socket.on("player_join", this.playerJoined);
		this.socket.on("game_state", this.initGameState);
		this.socket.on("player_turn", this.checkTurn);
		// this.socket.on("player_play_card_hand", this.checkSuccess); use callback instead
		this.socket.on("player_play_card_hand", this.checkOpponentMove);
		this.socket.on("game_end", this.gameEnd);
	}

	// private	playerJoined = (seatOrder: PlayerSeatOrderTransmit) =>
	// {
	// 	logger.verbose(this.id, seatOrder);
	// 	this.seatOrder = seatOrder;
	// 	if (seatOrder.seatOrder[this.id] == 3)
	// 	{	
	// 		const startRequest: GameStartRequest = {
	// 			playerId: this.id
	// 		}
	// 		this.socket?.emit("game_start", startRequest);
	// 		console.log(new Date().toTimeString());
	// 	}
	// }

	private initGameState = (gameState: GameStateTransmit) =>
	{
		this.state = new GameState(this.id, gameState.playerSeatOrder, gameState.playerCards);
		logger.verbose(this.id, this.state.ownCards);
	}
	
	private checkTurn = (playerTurn: PlayerTurnTransmit) =>
	{
		if (playerTurn.playerId == this.state.currentPlayer)
			return ;	
		if (this.state.turnSkipped)
		{
			logger.verbose(this.id, this.state.currentPlayer, "skipped their turn");
			this.state.recordSkippedMove(this.state.currentPlayer);
		}
		
		this.state.currentPlayer = playerTurn.playerId;
		if (this.state.currentPlayer == this.id)
		{
			logger.verbose(this.id, "My turn");
			// writeFileSync(`logs/state<${this.id}>${this.state.turnNumber}.log`, this.state.encode().join("\n"), "utf-8");
			this.playCardHand();
		}
		else
		{
			logger.verbose(this.id, `${this.state.currentPlayer}'s turn`);
			this.state.turnSkipped = true;
		}
	}

	private playCardHand = () =>
	{
		const cardHand: CardHand | null = this.ai.decide(this.id, this.state);

		if (cardHand == null)
		{
			logger.verbose(this.id, "skipping turn");
			this.state.turnSkipped = true;
			this.socket?.emit("player_skip_turn_request", (status: StatusTransmit) => {
				console.log("[botSocket] 'player_skip_turn_request' callback: ", status);
			});
		}
		else
		{
			cardHand.playerId = this.id;
			this.state.setLastCardHand(cardHand);
			this.state.removeCards(cardHand);
			logger.verbose(this.id, "attempting to play", cardHand);
			this.state.turnSkipped = false;
			this.socket?.emit("player_play_card_hand_request", cardHand, (status: StatusTransmit) => {
				console.log("[botSocket] 'player_play_card_hand_request' callback: ", status);
			});
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
			logger.verbose(opponentMove.playerId, "played:", opponentMove);
			this.state.turnSkipped = false;
			this.state.setLastCardHand(opponentMove);
		}
	}

	private	gameEnd = (stat: GameEndStatsTransmit) =>
	{
		this.gamesPlayed++;
		if (stat.winnerPlayerUuid == this.id)
		{
			logger.verbose(this.id, "I won");
			this.wins++;
			if (this.gamesPlayed != this.maxGames)
			{
				// const startRequest: GameStartRequest = {
				// 	playerId: this.id
				// };
				this.socket?.emit("game_start_request", (status: StatusTransmit) => {
					console.log("[botSocket] 'game_start_request':", status);
				});
			}
		}
		else
		{
			logger.verbose(this.id, "I lost");
		}
		if (this.gamesPlayed == this.maxGames)
		{
			logger.info(this.id, "I won", this.wins, "times");
			if (stat.winnerPlayerUuid == this.id)
				console.log(new Date().toTimeString());
		}
	}
	
	private disconnect = (reason: string) =>
	{
		logger.warn(this.id, "disconnected:", reason);
		this.socket?.disconnect();
		this.socket = null;
	}

}
