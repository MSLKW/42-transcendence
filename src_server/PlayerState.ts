import { Socket } from 'socket.io';
import { CardTransmit, CardHandTransmit, HandType, PentupleType } from '../src_shared/Types.js';
import { GameState } from './GameState.js';
import { CardHeapState } from './CardHeapState.js';
import { io } from './server.js';

export class PlayerState {
	public	socket: Socket;
	public	playerId: string;
	private cards: Array<CardTransmit>;
	private gameStateRef: GameState;
	private cardHeapRef: CardHeapState;

	constructor(playerId: string, socket: Socket, gameState: GameState) {
		this.playerId = playerId;
		this.cards = [];
		this.socket = socket;
		this.gameStateRef = gameState
		this.cardHeapRef = gameState.cardHeap;
		
		socket.on("playCardHand", (body) => {
			this.playCardHand(socket, body);
		});

		socket.on("playerSkipTurn", (body) => {
			this.gameStateRef.skipPlayerTurn(this);
		})
	}

	public collectCards(cards: Array<CardTransmit>) {
		for (let i = 0; i < cards.length; i++) {
			this.cards.push(cards[i]);
		}
		this.socket.emit('collectCards', JSON.stringify(cards));
	}

	private removeCard(card: CardTransmit) {
		for (let i = 0; i < this.cards.length; i++) {
			if (this.cards[i].rank === card.rank && this.cards[i].suite === card.suite) {
				this.cards.splice(i, 1);
				break ;
			}
		}
	}

	private removeCards(cards: Array<CardTransmit>) {
		for (let i = 0; i < cards.length; i++) {
			this.removeCard(cards[i]);
		}
	}

	public turnSignal() {
		this.socket.emit('playerTurn');
	}

	// Returns if player has finished all his cards
	private playCardHand(socket: Socket, body: string) {
		if (this.gameStateRef.isPlayerTurn(this) === false) {
			socket.emit('playCardHand', 'failure: not ur turn');
			return;
		}
		const cardHand = JSON.parse(body) as CardHandTransmit;
		if (cardHand.handType === HandType.None || (cardHand.handType === HandType.Pentuple && cardHand.pentupleType === PentupleType.None)) {
			socket.emit('playCardHand', 'failure: cardhand is not even a thing');
			return ;
		}
		if (this.cardHeapRef.isCardHandPlayable(cardHand) == false) {
			socket.emit('playCardHand', 'failure: cardhand is not playable');
			return ;
		}
		for (let i = 0; i < cardHand.cards.length; i++) {
			if (this.cards.findIndex((card: CardTransmit) => card.rank === cardHand.cards[i].rank && card.suite === cardHand.cards[i].suite ) == -1) {
				socket.emit('playCardHand', 'failure: cardhand not in playerState cards');
				return ;
			}
		}
		socket.emit('playCardHand', 'success');
		this.cardHeapRef.receiveCardHand(cardHand);
		this.removeCards(cardHand.cards);

		if (this.cards.length === 0) { // preferably want this in GameState since it's literally ending the game lol
			this.gameStateRef.endGame(this)
		}
		this.gameStateRef.nextPlayerTurn();
	}
}