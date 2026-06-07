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
		console.log(`Socket<${socket.id}> has connected`);
		socket.emit("initPlayer", socket.id); // can be some other id later
		
		socket.on("disconnect", () => {
			console.log(`Socket<${socket.id}> has disconnected`);
		})

		// pref only let the host do it or smth
		socket.on("startGame", (body) => {
			if (this.startGame() == true) {
				socket.emit("startGame", 'success');
			}
			else {
				socket.emit("startGame", 'failure');
			}
		})

		if (this.players.length <= 4 && this.isGameStarted == false) {
			this.players.push(new PlayerState(socket, this));
			socket.join("game");
		}
		else {
			socket.disconnect(true);
			console.log('disconnecting socket cuz players are full');
		}
	}

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
		for (let i = 0; i < this.players.length; i++) {
			this.players[i].collectCards(this.cardDeck.dealCards(13));
		}
		this.isGameStarted = true;
		this.playerTurnIndex = 0; // find player with 3 of diamonds and set player turn index to it
		this.playerTurnEvent();
		return (true);
	}

	public endGame() {
		
	}
}