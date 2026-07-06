import { Socket } from 'socket.io';
import { io } from './server.js';
import { PlayerState } from './PlayerState.js';
import { CardDeckState } from './CardDeckState.js'
import { CardHeapState } from './CardHeapState.js'
import { GameStateTransmit, PlayerSeatOrderTransmit, GameEndStatsTransmit, statusTransmit, playerTurnTransmit } from '../src_shared/Types.js';

export class GameState {
	private players: Array<PlayerState>;
	private cardDeck: CardDeckState;
	public	cardHeap: CardHeapState;
	private isGameStarted: boolean;
	private	playerTurnIndex: number;
	private playerTurnTimeoutId: NodeJS.Timeout | undefined;

	// Game Settings
	private turnTimerInSeconds: number;
	private playersInGameLimit: number; // Players allowed in the game
	private totalPlayersLimit: number; // Players allowed in the lobby
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
		this.totalPlayersLimit = 8;

		io.on("connection", (socket) => {
			this.connectPlayer(socket);
		});
	}

	private getSeatOrder() {
		const seatOrder: Record<string, number> = {};
		for (let i = 0; i < this.players.length; i++) {
			seatOrder[this.players[i].playerId] = i;
		}
		return (seatOrder)
	}

	private connectPlayer(socket: Socket) {
		const authId: string = socket.handshake.auth.token;
		
		// Convert authId to playerId with authentication system
		const playerId = authId

		socket.on("disconnect", () => {
			if (this.isGameStarted == false) {
				const index = this.players.findIndex((player) => player.playerId === playerId);
				if (index != -1) {
					this.players.splice(index, 1);
					console.log(`Player<${playerId}> has disconnected`);
				}
			}
		})

		// pref only let the host do it or smth
		socket.on("game_start", (body) => {
			socket.emit("game_start", this.startGame());
		})

		const index = this.players.findIndex((player) => player.playerId === playerId);
		if (index == -1 && this.players.length < this.playersInGameLimit && this.isGameStarted == false) {
			console.log(`Player<${playerId}> has connected`);
			const player = new PlayerState(playerId, socket, this);
			this.players.push(player);
			this.playerJoin(player);
		}
		else if (this.isGameStarted == true && index >= 0) {
			console.log(`Player<${playerId}> has reconnected`);
			const player = this.players[index];
			player.socket = socket;
			player.setupSocketListeners();
			this.playerJoin(player);
			player.socket.emit("player_game_state", JSON.stringify(this.transmit(player)));
		}
		else {
			socket.emit("graceful_disconnect");
			setTimeout(() => {
				socket.disconnect(true);
			}, 1000);
			console.log(`Player<${playerId}> is not allowed to connect`);
		}
	}

	private playerJoin(player: PlayerState) {
		const seatOrderTransmit: PlayerSeatOrderTransmit = {
			"playerId": player.playerId,
			"seatOrder": this.getSeatOrder()
		}
		player.socket.join("game");
		io.to("game").emit("player_join", JSON.stringify(seatOrderTransmit))
	}

	private playerTurnEvent() {
		const player = this.players.at(this.playerTurnIndex);
		if (player === undefined) {
			console.log('Player is missing for player turn');
			return ;
		}
		const playerTurnTransmit: playerTurnTransmit = {
			playerId: player.playerId,
			timer: this.turnTimerInSeconds
		}
		if (this.turnTimerInSeconds > 0) {
			this.playerTurnTimeoutId = setTimeout(() => {this.playerTimeout(player)}, this.turnTimerInSeconds * 1000);
		}
		io.to("game").emit("player_turn", playerTurnTransmit);
	}

	private playerTimeout(player: PlayerState) {
		console.log(`Timing out player<${player.playerId}>`)
		const status: statusTransmit = {
			success: true,
			message: "Timer ran out"
		}
		player.socket.emit("player_skip_turn", status);
		this.nextPlayerTurn();
	}

	public nextPlayerTurn() {
		clearTimeout(this.playerTurnTimeoutId);
		this.playerTurnTimeoutId = undefined;
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

	private playerCardsAmount() {
		const playerCardsAmount: Record<string, number> = {};
		for (let i = 0; i < this.players.length; i++) {
			playerCardsAmount[this.players[i].playerId] = this.players[i].cards.length;
		}
		return (playerCardsAmount);
	}

	public startGame(): statusTransmit {
		const status: statusTransmit = {
			success: false,
			message: ""
		}
		if (this.isGameStarted == true) {
			status.message = "Game has already started"
			return (status);
		}
		for (let i = 0; i < this.players.length; i++) {
			this.players[i].collectCards(this.cardDeck.dealCards(Math.floor(this.cardDeck.size / this.players.length)));
		}
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].hasThreeDiamonds()) {
				this.playerTurnIndex = i;
				if (this.players.length === 3) { 
					this.players[i].collectCards(this.cardDeck.dealCards(1));
				}
			}
		}
		if (this.playerTurnIndex === -1)
			this.playerTurnIndex = 0;
		for (let i = 0; i < this.players.length; i++) {
			this.players[i].socket.emit("player_game_state", JSON.stringify(this.transmit(this.players[i])));
		}
		this.playerTurnEvent();
		this.isGameStarted = true;
		console.log("Game Started");
		status.success = true;
		status.message = "Game has successfully started";
		return (status);
	}

	public endGame(player: PlayerState) {
		console.log(`Game Ended | Winner is Player<${player.playerId}>`);
		const gameEndStats: GameEndStatsTransmit = {
			winnerPlayerId: player.playerId,
			playerFinalCardAmounts: this.playerCardsAmount(),
		}
		this.cardHeap.reset();
		this.cardDeck.reset();
		this.playerTurnIndex = -1;
		this.isGameStarted = false;
		io.to("game").emit("game_end", JSON.stringify(gameEndStats));
	}

	// For reconnecting player state
	public transmit(player: PlayerState) {
		const transmitObject: GameStateTransmit = {
			cardHeap: this.cardHeap.transmit(),
			playerCardsAmount: this.playerCardsAmount(),
			playerCards: player.cards,
			isPlayerTurn: this.isPlayerTurn(player)
		}
		return (transmitObject);
	}
}