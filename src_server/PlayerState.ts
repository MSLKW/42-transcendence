import { CardTransmit } from '../src_shared/Types.js';
import { CardHandTransmit, HandType, PentupleType } from '../src_shared/Types.js';
import { CardHeapState } from './CardHeapState.js';
import { Socket } from 'socket.io';
import { io } from './server.js';

export class PlayerState {
	public	socket: Socket;
	private cards: Array<CardTransmit>;
	private cardHeapRef: CardHeapState;

	constructor(socket: Socket, cardHeapRef: CardHeapState) {
		this.cards = [];
		this.socket = socket;
		this.cardHeapRef = cardHeapRef;
		
		socket.on("playCardHand", (body) => {
			this.playCardHand(socket, body);
		});
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

	// Returns if player has finished all his cards
	private playCardHand(socket: Socket, body: string) {
		const cardHand = JSON.parse(body) as CardHandTransmit;
		if (cardHand.handType === HandType.None || (cardHand.handType === HandType.Pentuple && cardHand.pentupleType === PentupleType.None)) {
			socket.emit('playCardHand', 'failure');
			return ;
		}
		if (this.cardHeapRef.isCardHandPlayable(cardHand) == false) {
			socket.emit('playCardHand', 'failure');
			return ;
		}
		for (let i = 0; i < cardHand.cards.length; i++) {
			if (this.cards.findIndex((card: CardTransmit) => card.rank === cardHand.cards[i].rank && card.suite === cardHand.cards[i].suite ) == -1) {
				socket.emit('playCardHand', 'failure');
				return ;
			}
		}
		socket.emit('playCardHand', 'success');
		this.cardHeapRef.receiveCardHand(cardHand);
		this.removeCards(cardHand.cards);

		if (this.cards.length === 0) { // preferably want this in GameState since it's literally ending the game lol
			io.to("game").emit("endGame", `Socket<${socket.id} won the game!`);
		}
	}
}