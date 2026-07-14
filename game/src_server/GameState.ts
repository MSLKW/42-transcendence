import { Socket } from 'socket.io';
import { io } from './server.js';
import { PlayerState } from './PlayerState.js';
import { CardDeckState } from './CardDeckState.js'
import { CardHeapState } from './CardHeapState.js'
import { GameStateTransmit, GameEndStatsTransmit, StatusTransmit, PlayerTurnTransmit, GameStartRequest, SkipTurnTransmit } from '../src_shared/Types.js';
import { UserState } from './UserState.js';

export class GameState {
	private players: Array<PlayerState>;
	private cardDeck: CardDeckState;
	public	cardHeap: CardHeapState;
	public	isGameStarted: boolean;
	private	playerTurnIndex: number;
	private playerTurnTimeoutId: NodeJS.Timeout | undefined;

	// Game Settings
	public	turnTimerInSeconds: number;
	private playersInGameLimit: number; // Players allowed in the game
	// Play until last player or when the first player finishes
	// if play until last player finishes, will score based on finishing ranking?
	// if play until first player finishes, will score based on cards held by the losers
	
	constructor() {
		this.players = [];
		this.cardDeck = new CardDeckState();
		this.cardHeap = new CardHeapState();
		this.isGameStarted = false;
		this.playerTurnIndex = -1;
		this.playerTurnTimeoutId = undefined;
		this.turnTimerInSeconds = 0;
		this.playersInGameLimit = 4;
	}

	/*
		@param user: Should be the users who want to play in the game
	*/
	public startGame(users: Array<UserState>): StatusTransmit {
		const status: StatusTransmit = {
			success: false,
			message: ""
		}
		if (users.length === 0) {
			status.message = "No users to start game";
			return (status);
		}
		if (this.isGameStarted === true) {
			status.message = "Game has already started"
			return (status);
		}
		for (let i = 0; i < users.length; i++) {
			const player = new PlayerState(users[i].uuid, users[i].socket, this)
			this.players.push(player);
		}
		for (let i = 0; i < this.players.length; i++) {
			this.players[i].collectCards(this.cardDeck.dealCards(Math.floor(this.cardDeck.size / this.players.length)));
		}
		for (let i = 0; i < this.players.length; i++) {
			if (PlayerState.hasThreeDiamonds(this.players[i].cards)) {
				this.playerTurnIndex = i;
				if (this.players.length === 3) { 
					this.players[i].collectCards(this.cardDeck.dealCards(1));
				}
			}
		}
		if (this.playerTurnIndex === -1)
			this.playerTurnIndex = 0;
		for (let i = 0; i < this.players.length; i++) {
			this.players[i].socket.emit("player_game_state", this.transmit(this.players[i]));
		}
		this.playerTurnEvent();
		this.isGameStarted = true;
		console.log("Game Started");
		status.success = true;
		status.message = "Game has successfully started";
		return (status);
	}

	public endGame(winner: PlayerState) {
		console.log(`Game Ended | Winner is Player<${winner.playerId}>`);
		const gameEndStats: GameEndStatsTransmit = {
			winnerPlayerId: winner.playerId,
			playerFinalCardAmounts: this.getPlayerCardsAmount(),
			playerPenaltyPoints: this.getPlayerPenaltyPoints()
		}
		this.resetGame();
		this.isGameStarted = false;
		io.to("game").emit("game_end", gameEndStats);
	}

	private resetGame() {
		this.cardHeap.reset();
		this.cardDeck.reset();
		for (let i = 0; i < this.players.length; i++) {
			this.players[i].reset();
		}
		this.players.length = 0;
		clearTimeout(this.playerTurnTimeoutId);
		this.playerTurnTimeoutId = undefined;
		this.playerTurnIndex = -1;
	}

	private getSeatOrder() {
		const seatOrder: Record<string, number> = {};
		for (let i = 0; i < this.players.length; i++) {
			seatOrder[this.players[i].playerId] = i;
		}
		return (seatOrder);
	}

	public userInGame(user: UserState): boolean {
		const player = this.players.find((player) => player.playerId === user.uuid);
		if (player === undefined) {
			return (false);
		}
		return (true);
	}

	public playerReconnect(user: UserState) {
		const player = this.players.find((player) => player.playerId === user.uuid);
		if (player === undefined) {
			return ;
		}
		player.reconnect(user);
	}

	public playerDisconnect(user: UserState) {
		const player = this.players.find((player) => player.playerId === user.uuid);
		if (player === undefined) {
			return ;
		}
		player.disconnect();
	}

	private playerTurnEvent() {
		const player = this.players.at(this.playerTurnIndex);
		if (player === undefined || player.isDisconnected === true) {
			console.log("player has disconnected, going to next player");
			this.nextPlayerTurn();
			return ;
		}
		const playerTurnTransmit: PlayerTurnTransmit = {
			playerId: player.playerId,
			skippable: !this.cardHeap.isPlayerLeading(player.playerId),
			timer: this.turnTimerInSeconds
		}
		if (this.turnTimerInSeconds > 0) {
			this.playerTurnTimeoutId = setTimeout(() => {this.playerTimeout(player)}, this.turnTimerInSeconds * 1000);
		}
		io.to("game").emit("player_turn", playerTurnTransmit);
	}

	private playerTimeout(player: PlayerState) {
		console.log(`Timing out player<${player.playerId}>`)
		const status: StatusTransmit = {
			success: true,
			message: "Timer ran out"
		}
		player.socket.emit("player_skip_turn_request", status);
		player.skipTurn();
	}

	public nextPlayerTurn() {
		clearTimeout(this.playerTurnTimeoutId);
		this.playerTurnTimeoutId = undefined;
		const availablePlayer = this.players.find((player) => player.isDisconnected === false)
		if (availablePlayer === undefined) {
			return ;
		}
		this.playerTurnIndex++;
		if (this.playerTurnIndex >= this.players.length)
			this.playerTurnIndex = 0;
		this.playerTurnEvent();
	}

	public isPlayerTurn(player: PlayerState) {
		if (this.players.indexOf(player) === this.playerTurnIndex) {
			return (true);
		}
		return (false);
	}

	private getPlayerCardsAmount() {
		const playerCardsAmount: Record<string, number> = {};
		for (let i = 0; i < this.players.length; i++) {
			playerCardsAmount[this.players[i].playerId] = this.players[i].cards.length;
		}
		return (playerCardsAmount);
	}

	private getPlayerPenaltyPoints() {
		const playerPenaltyPoints: Record<string, number> = {};
		for (let i = 0; i < this.players.length; i++) {
			playerPenaltyPoints[this.players[i].playerId] = this.players[i].calculatePenaltyPoints();
		}
		return (playerPenaltyPoints);
	}

	// For reconnecting player state
	public transmit(player: PlayerState) {
		const transmitObject: GameStateTransmit = {
			cardHeap: this.cardHeap.transmit(),
			playerCardsAmount: this.getPlayerCardsAmount(),
			playerSeatOrder: this.getSeatOrder(),
			playerCards: player.cards,
			isPlayerTurn: this.isPlayerTurn(player)
		}
		return (transmitObject);
	}
}