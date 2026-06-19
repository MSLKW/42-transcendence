import { Socket } from 'socket.io';
import { io } from './server.js';
import { PlayerState } from './PlayerState.js';
import { CardDeckState } from './CardDeckState.js'
import { CardHeapState } from './CardHeapState.js'

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
		this.playerTurnIndex = 0;

		io.on("connection", (socket) => {
			this.connectPlayer(socket);
		});
	}

	private connectPlayer(socket: Socket) {
		const playerId: string = socket.handshake.auth.token;
		
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
		socket.on("start_game", (body) => {
			if (this.startGame() == true) {
				socket.emit("start_game", 'success');
			}
			else {
				socket.emit("start_game", 'failure');
			}
		})

		const index = this.players.findIndex((player) => player.playerId === playerId);
		if (index == -1 && this.players.length < 4 && this.isGameStarted == false) {
			console.log(`Player<${playerId}> has connected`);
			this.players.push(new PlayerState(playerId, socket, this));
			socket.emit("init_player", playerId); // can be some other id later
			socket.join("game");
		}
		else if (this.isGameStarted == true && index >= 0) {
			console.log(`Player<${playerId}> has reconnected`);
			socket.emit("init_player", playerId); // can be some other id later
			socket.join("game");
		}
		else {
			socket.emit("graceful_disconnect");
			setTimeout(() => {
				socket.disconnect(true);
			}, 1000);
			console.log(`Player<${playerId}> is not allowed to connect`);
		}
	}

	// private disconnectPlayer()

	private playerTurnEvent() {
		const player = this.players.at(this.playerTurnIndex);
		if (player) {
			player.turnSignal();
		}
		else if (player === undefined) {
			console.log('Player is missing for player turn');
		}
	}

	public nextPlayerTurn() {
		this.playerTurnIndex++;
		if (this.playerTurnIndex >= this.players.length)
			this.playerTurnIndex = 0;
		this.playerTurnEvent();
	}

	public	isPlayerTurn(player: PlayerState) {
		if (this.players.indexOf(player) === this.playerTurnIndex) {
			return (true);
		}
		return (false);
	}

	public skipPlayerTurn(player: PlayerState) {
		if (this.isPlayerTurn(player)) {
			this.nextPlayerTurn();
		}
	}

	public startGame(): boolean {
		if (this.isGameStarted == true)
			return (false);
		console.log("Game Started")
		for (let i = 0; i < this.players.length; i++) {
			this.players[i].collectCards(this.cardDeck.dealCards(13));
		}
		this.isGameStarted = true;
		this.playerTurnIndex = 0; // find player with 3 of diamonds and set player turn index to it
		this.playerTurnEvent();
		return (true);
	}

	public endGame(player: PlayerState) {
		console.log(`Game Ended | Winner is Player<${player.playerId}>`);
		io.to("game").emit("endGame", `Player<${player.playerId}> won the game!`);
	}

	public transmitGameState() {
		// for reconnection
		// card heap cards, arg requires a playerState to send to
		/*
		cardHeap: [
			{ card hands }
		]
		otherPlayerCardsAmounts: [
		
		]
		playerCards {
			just grab from playerState
		}

		*/
	}
}