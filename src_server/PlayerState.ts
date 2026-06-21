import { Socket } from 'socket.io';
import { CardTransmit, CardRank, CardSuite, CardHandTransmit, HandType, PentupleType } from '../src_shared/Types.js';
import { GameState } from './GameState.js';
import { CardHeapState } from './CardHeapState.js';
import { io } from './server.js';

export class PlayerState {
	public	socket: Socket;
	public	playerId: string;
	public cards: Array<CardTransmit>;
	private gameStateRef: GameState;
	private cardHeapRef: CardHeapState;

	constructor(playerId: string, socket: Socket, gameState: GameState) {
		this.playerId = playerId;
		this.cards = [];
		this.socket = socket;
		this.gameStateRef = gameState
		this.cardHeapRef = gameState.cardHeap;
		
		socket.on("player_play_card_hand", (body) => {
			this.playCardHand(socket, body);
		});

		socket.on("player_skip_turn", (body) => {
			this.skipTurn();
		})
	}

	public collectCards(cards: Array<CardTransmit>) {
		for (let i = 0; i < cards.length; i++) {
			this.cards.push(cards[i]);
		}
		this.socket.emit('collect_cards', JSON.stringify(cards));
	}

	public hasThreeDiamonds(): boolean {
		const card = this.cards.find((card) => card.rank === CardRank.Three && card.suite === CardSuite.Diamond);
		if (card)
			return (true);
		return (false);
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
		this.socket.emit('player_turn');
	}

	public skipTurn() {
		if (this.gameStateRef.isPlayerTurn(this)) {
			this.gameStateRef.nextPlayerTurn();
			this.socket.emit("player_skip_turn", "success");
		}
		this.socket.emit("player_skip_turn", "false");
	}

	// Returns if player has finished all his cards
	private playCardHand(socket: Socket, body: string) {
		if (this.gameStateRef.isPlayerTurn(this) === false) {
			socket.emit('player_play_card_hand', 'failure: not ur turn');
			return;
		}
		const cardHand = JSON.parse(body) as CardHandTransmit;
		if (cardHand.handType === HandType.None || (cardHand.handType === HandType.Pentuple && cardHand.pentupleType === PentupleType.None)) {
			socket.emit('player_play_card_hand', 'failure: cardhand is not even a thing');
			return ;
		}
		if (this.cardHeapRef.isCardHandPlayable(cardHand) == false) {
			socket.emit('player_play_card_hand', 'failure: cardhand is not playable');
			return ;
		}
		for (let i = 0; i < cardHand.cards.length; i++) {
			if (this.cards.findIndex((card: CardTransmit) => card.rank === cardHand.cards[i].rank && card.suite === cardHand.cards[i].suite ) == -1) {
				socket.emit('player_play_card_hand', 'failure: cardhand not in playerState cards');
				return ;
			}
		}
		socket.emit('player_play_card_hand', 'success');
		this.cardHeapRef.receiveCardHand(cardHand);
		this.removeCards(cardHand.cards);

		if (this.cards.length === 0) { // preferably want this in GameState since it's literally ending the game lol
			this.gameStateRef.endGame(this)
		}
		this.gameStateRef.nextPlayerTurn();
	}
}