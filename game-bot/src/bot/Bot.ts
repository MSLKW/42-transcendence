import { io, Socket } from "socket.io-client";
import { setTimeout } from "timers/promises";
import { GameState } from "../game/GameState.js";
import { AAIController } from "../ai/AAIController.js";
import { logger } from "../utils/logger.js";
import { CardHandTransmit as CardHand, GameEndStatsTransmit } from "@big2/game-types";

import {
	GameStateTransmit,
	PlayerTurnTransmit,
	SkipTurnTransmit,
	StatusTransmit
} from "@big2/game-types";

const CONNECTION_MAX_ATTEMPTS = 3;
const CONNECTION_RETRY_DELAY_MS = 1000;

function connectSocket(serverUrl: string, lobbyId: string, botSessionToken: string): Promise<Socket | null>
{
	return new Promise((resolve) => {
		const socket = io(serverUrl, {
			reconnection: false,
			auth: {
				lobbyId:			lobbyId,
				botSessionToken:	botSessionToken
			}
		});
		socket.once("connect", () => { resolve(socket) });
		socket.once("connect_error", () => { resolve(null) });
	});
}

export class Bot
{
	constructor(private id: string, private ai: AAIController) {}

	private state:	GameState = new GameState();
	private socket:	Socket | null = null;

	async start(serverUrl: string, lobbyId: string, seatIndex: number, botSessionToken: string): Promise<boolean>
	{
		for (let attempt = 0; attempt < CONNECTION_MAX_ATTEMPTS && this.socket == null; ++attempt)
		{
			await setTimeout(CONNECTION_RETRY_DELAY_MS * attempt)
			logger.verbose(this.id, `connecting socket to ${serverUrl} (attempt ${attempt})`);
			this.socket = await connectSocket(serverUrl, lobbyId, botSessionToken);
		}
		if (!this.socket)
		{
			logger.error(this.id, `failed to connect to ${serverUrl}`);
			return false;
		}
		logger.info(this.id, `connected to ${serverUrl}`);
		if (!(await this.socket.emitWithAck("user_seat_take", seatIndex)).success)
		{
			logger.error(this.id, "failed to take seat");
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

		this.socket.on("disconnect", this.disconnect);
		this.socket.on("graceful_disconnect", this.disconnect);
	
		this.socket.on("game_settings_update", ()=>{});
		this.socket.on("game_state", this.initGameState);

		this.socket.on("player_turn", this.checkTurn);
		this.socket.on("player_play_card_hand", this.registerOpponentMove);
		this.socket.on("player_skip_turn", this.registerOpponentSkip);
		this.socket.on("game_end", this.gameEnd);
	}

	private initGameState = (stateTransmit: GameStateTransmit) =>
	{
		this.state = new GameState(this.id, stateTransmit);
		logger.verbose(this.id, this.state.ownCards);
	}
		
	private checkTurn = (playerTurn: PlayerTurnTransmit) =>
	{
		if (playerTurn.playerId == this.id)
		{
			logger.info(this.id, "my turn");
			this.playCardHand();
		}
		else
			logger.info(this.id, `${playerTurn.playerId}'s turn`);
	}

	private playCardHand = async () =>
	{
		const cardHand = this.ai.decide(this.id, this.state);

		if (cardHand == null)
		{
			logger.verbose(this.id, "skipping turn");
			const status: StatusTransmit = await this.socket?.emitWithAck("player_skip_turn_request");
			if (!status.success)
				logger.error(this.id, `failed to skip turn: ${status.message}`);
		}
		else
		{
			this.state.setLastCardHand(cardHand);
			this.state.removeCards(cardHand);
			logger.verbose(this.id, "attempting to play", cardHand);
			const status: StatusTransmit = await this.socket?.emitWithAck("player_play_card_hand_request", cardHand);
			if (!status.success)
				logger.error(this.id, "failed to play card hand");
		}
	}

	private registerOpponentMove = (opponentMove: CardHand) =>
	{
		if (opponentMove.playerId != this.id)
		{
			logger.verbose(opponentMove.playerId, "played:", opponentMove);
			this.state.setLastCardHand(opponentMove);
		}
	}

	private registerOpponentSkip = (opponentSkip: SkipTurnTransmit) =>
	{
		logger.info(this.id, `player<${opponentSkip.playerId}> skipped their turn`);
	}

	private	gameEnd = (stats: GameEndStatsTransmit) =>
	{
		if (stats.winnerPlayerUuid == this.id)
			logger.info(this.id, "I won");
		else
		{
			logger.info(this.id, "I lost");
			logger.verbose(`(${stats.playerFinalCardAmounts[this.id]} cards remaining and ${stats.playerPenaltyPoints} penalty points)`);
		}
	}
	
	private disconnect = (reason: string) =>
	{
		logger.info(this.id, "disconnected:", reason);
		this.socket?.disconnect();
		this.socket = null;
	}
}
