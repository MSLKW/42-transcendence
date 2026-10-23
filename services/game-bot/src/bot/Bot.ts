import { io, Socket } from "socket.io-client";
import { setTimeout } from "timers/promises";
import { BotManager } from "./BotManager.js";
import { GameState } from "../game/GameState.js";
import { AAIController } from "../ai/AAIController.js";
import { Logger } from "../utils/logger.js";
import { CardHandTransmit as CardHand, GameEndStatsTransmit } from "@big2/game-types";
import { BOT_MOVE_DELAY_MIN, BOT_MOVE_DELAY_MAX } from "../config.js";

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
	constructor(private id: string, private ai: AAIController, private manager: BotManager)
	{
		this.logger = new Logger(this.id);
	}

	private state:	GameState = new GameState();
	private socket:	Socket | null = null;
	private logger: Logger;

	async start(serverUrl: string, lobbyId: string, seatIndex: number, botSessionToken: string): Promise<boolean>
	{
		for (let attempt = 0; attempt < CONNECTION_MAX_ATTEMPTS && this.socket == null; ++attempt)
		{
			await setTimeout(CONNECTION_RETRY_DELAY_MS * attempt)
			this.logger.verbose(this.id, `connecting socket to ${serverUrl} (attempt ${attempt})`);
			this.socket = await connectSocket(serverUrl, lobbyId, botSessionToken);
		}
		if (!this.socket)
		{
			this.logger.error(this.id, `failed to connect to ${serverUrl}`);
			return false;
		}
		this.logger.info(this.id, `connected to ${serverUrl}`);
		if (!(await this.socket.emitWithAck("user_seat_take", seatIndex)).success)
		{
			this.logger.error(this.id, "failed to take seat");
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
		this.logger.verbose(this.id, this.state.ownCards);
	}
		
	private checkTurn = (playerTurn: PlayerTurnTransmit) =>
	{
		if (playerTurn.playerId == this.id)
		{
			this.logger.info(this.id, "my turn");
			this.playCardHand(playerTurn.timer, playerTurn.skippable);
		}
		else
			this.logger.info(this.id, `${playerTurn.playerId}'s turn`);
	}

	private playCardHand = async (timerMs: number, skippable: boolean) =>
	{
		if (timerMs == 0)
			timerMs = 5000;
		const moveDelayMs = (Math.random()	* (BOT_MOVE_DELAY_MAX - BOT_MOVE_DELAY_MIN) + BOT_MOVE_DELAY_MIN) * timerMs;
		const deadline = Date.now() + moveDelayMs;

		const cardHand = this.ai.decide(this.id, this.state, skippable);
		
		if (cardHand == null)
		{
			const delayRemainingMs = (deadline - Date.now()) / 2;
			if (delayRemainingMs > 0)
				await setTimeout(delayRemainingMs);

			this.logger.verbose(this.id, "skipping turn");
			const status: StatusTransmit = await this.socket?.emitWithAck("player_skip_turn_request");
			if (!status.success)
				this.logger.error(this.id, `failed to skip turn: ${status.message}`);
		}
		else
		{
			const delayRemainingMs = deadline - Date.now();
			if (delayRemainingMs > 0)
				await setTimeout(delayRemainingMs);

			cardHand.playerId = this.id;
			this.state.setLastCardHand(cardHand);
			this.state.removeCards(cardHand);
			this.logger.verbose(this.id, "playing hand:", cardHand);
			const status: StatusTransmit = await this.socket?.emitWithAck("player_play_card_hand_request", cardHand);
			if (!status.success)
				this.logger.error(this.id, `failed to play card hand: ${status.message}`);
		}
	}

	private registerOpponentMove = (opponentMove: CardHand) =>
	{
		if (opponentMove.playerId != this.id)
		{
			this.logger.verbose(opponentMove.playerId, "played:", opponentMove);
			this.state.setLastCardHand(opponentMove);
		}
	}

	private registerOpponentSkip = (opponentSkip: SkipTurnTransmit) =>
	{
		if (opponentSkip.playerId != this.id)
			this.logger.info(this.id, `${opponentSkip.playerId} skipped their turn`);
	}

	private	gameEnd = (stats: GameEndStatsTransmit) =>
	{
		if (stats.winnerPlayerUuid == this.id)
			this.logger.info(this.id, "I won");
		else
		{
			this.logger.info(this.id, "I lost");
			this.logger.verbose(this.id, `(${stats.playerFinalCardAmounts[this.id]} cards remaining and ${stats.playerPenaltyPoints[this.id]} penalty points)`);
		}
	}
	
	private disconnect = (reason: string) =>
	{
		this.logger.info(this.id, "disconnected:", reason);
		this.logger.close();
		this.socket?.disconnect();
		this.socket = null;
		this.manager.removeBot(this.id);
	}
}
