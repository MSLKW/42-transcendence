import { PlayerState } from './PlayerState.js';
import { io } from './server.js';
import { CardDeckState } from './CardDeckState.js'
import { CardHeapState } from './CardHeapState.js'
import { Socket } from 'socket.io';

export class GameState {
	private players: Array<PlayerState>;
	private cardDeck: CardDeckState;
	private cardHeap: CardHeapState;
	private isGameStarted: boolean;
	// Player Turn: index
	// io

	constructor() {
		this.players = [];
		this.cardDeck = new CardDeckState();
		this.cardHeap = new CardHeapState();
		this.isGameStarted = false;

		io.on("connection", (socket) => {
			this.connectPlayer(socket);	
		});
	}

	private connectPlayer(socket: Socket) {
		console.log(`Socket<${socket.id}> has connected`);
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
			this.players.push(new PlayerState(socket, this.cardHeap));
			socket.join("game");
		}
		else {
			socket.disconnect(true);
			console.log('disconnecting socket cuz players are full');
		}
	}

	public startGame(): boolean {
		if (this.isGameStarted == true)
			return (false);
		for (let i = 0; i < this.players.length; i++) {
			this.players[i].collectCards(this.cardDeck.dealCards(13));
		}
		this.isGameStarted = true;
		return (true);
	}

	public endGame() {
		
	}
}