import { Socket } from 'socket.io';
import { io } from './server.js';
import { PlayerState } from './PlayerState.js';
import { CardDeckState } from './CardDeckState.js'
import { CardHeapState } from './CardHeapState.js'
import { GameStateTransmit, PlayerSeatOrderTransmit } from '../src_shared/Types.js';

export class GameState {
	private players: Array<PlayerState>;
	private cardDeck: CardDeckState;
	public	cardHeap: CardHeapState;
	private isGameStarted: boolean;
	private	playerTurnIndex: number;

	constructor() {
		this.players = [];
		this.cardDeck = new CardDeckState();
		this.cardHeap = new CardHeapState();
		this.isGameStarted = false;
		this.playerTurnIndex = -1;

		io.on("connection", (socket) => {
			this.connectPlayer(socket);
		});
	}

	private getSeatOrder() {
		/*
		seatOrder: {
			playerId0: 0
			playerId1: 1
			playerId2: 2
			playerId3: 3
		}
		*/
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
			if (this.startGame() == true) {
				socket.emit("game_start", 'success');
			}
			else {
				socket.emit("game_start", 'failure');
			}
		})

		const index = this.players.findIndex((player) => player.playerId === playerId);
		if (index == -1 && this.players.length < 4 && this.isGameStarted == false) {
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
		player.turnSignal();
	}

	public nextPlayerTurn() {
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

	public startGame(): boolean {
		if (this.isGameStarted == true)
			return (false);
		console.log("Game Started");
		for (let i = 0; i < this.players.length; i++) {
			this.players[i].collectCards(this.cardDeck.dealCards(Math.floor(this.cardDeck.size / this.players.length)));
		}
		this.isGameStarted = true;
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
		// this.playerTurnEvent();
		return (true);
	}

	public endGame(player: PlayerState) {
		console.log(`Game Ended | Winner is Player<${player.playerId}>`);
		io.to("game").emit("game_end", `Player<${player.playerId}> won the game!`);
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