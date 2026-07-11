import { Socket } from 'socket.io';
import { CardTransmit, CardRank, CardSuit, CardHandTransmit, HandType, PentupleType, statusTransmit } from '../src_shared/Types.js';
import { GameState } from './GameState.js';
import { CardHeapState } from './CardHeapState.js';
import { io } from './server.js';
import { CardHandState } from './CardHandState.js';

export class PlayerState {
	public	socket: Socket;
	public	playerId: string;
	public	cards: Array<CardTransmit>;
	private gameStateRef: GameState;
	private cardHeapRef: CardHeapState;

	constructor(playerId: string, socket: Socket, gameState: GameState) {
		this.playerId = playerId;
		this.cards = [];
		this.socket = socket;
		this.gameStateRef = gameState;
		this.cardHeapRef = gameState.cardHeap;

		this.setupSocketListeners()
	}

	public setupSocketListeners() {
		this.socket.on("player_play_card_hand", (cardHandTransmit: CardHandTransmit) => {
			this.socket.emit('player_play_card_hand', this.playCardHand(cardHandTransmit));
		});

		this.socket.on("player_skip_turn", () => {
			this.skipTurn();
		})
	}

	public collectCards(cards: Array<CardTransmit>) {
		for (let i = 0; i < cards.length; i++) {
			this.cards.push(cards[i]);
		}
	}

	public static hasThreeDiamonds(cards: Array<CardTransmit>): boolean {
		const card = cards.find((card) => card.rank === CardRank.Three && card.suit === CardSuit.Diamond);
		if (card)
			return (true);
		return (false);
	}

	private removeCard(card: CardTransmit) {
		for (let i = 0; i < this.cards.length; i++) {
			if (this.cards[i].rank === card.rank && this.cards[i].suit === card.suit) {
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

	public skipTurn() {
		const status: statusTransmit = {
			success: false,
			message: "It's not the player's turn"
		}
		if (this.gameStateRef.isPlayerTurn(this)) {
			this.gameStateRef.nextPlayerTurn();
			status.success = true;
			status.message = "Player has successfully skipped their turn";
		}
		this.socket.emit("player_skip_turn", status);
	}

	// Returns if player has finished all his cards
	private playCardHand(cardHandTransmit: CardHandTransmit): statusTransmit {
		const status: statusTransmit = {
			success: false,
			message: ""
		};
		if (this.gameStateRef.isPlayerTurn(this) === false) {
			status.message = "Not your turn";
			return (status);
		}
		const cardHand = new CardHandState(cardHandTransmit.cards, cardHandTransmit.playerId);
		if (cardHand.compareTypes(cardHandTransmit) === false) {
			status.message = "handtype or pentuple type send by client is inaccurate";
			return (status);
		}
		if (cardHand.handType === HandType.None || (cardHand.handType === HandType.Pentuple && cardHand.pentupleType === PentupleType.None)) {
			status.message = "cardhand is not even a thing";
			return (status);
		}
		for (let i = 0; i < cardHand.cards.length; i++) {
			if (this.cards.findIndex((card: CardTransmit) => card.rank === cardHand.cards[i].rank && card.suit === cardHand.cards[i].suit ) == -1) {
				status.message = "cardhand cards not in playerState cards";
				return (status);
			}
		}
		if (this.cardHeapRef.isCardHandPlayable(cardHand) == false) {
			status.message = "cardhand is not playable";
			return (status);
		}
		if (this.cardHeapRef.cardHandsAmount() === 0 && PlayerState.hasThreeDiamonds(cardHand.cards) === false) {
			status.message = "first cardhand played must contain three of diamonds";
			return (status);
		}
		this.cardHeapRef.receiveCardHand(cardHand);
		this.removeCards(cardHand.cards);

		if (this.cards.length === 0) {
			this.gameStateRef.endGame(this)
		}
		this.gameStateRef.nextPlayerTurn();
		status.success = true;
		status.message = "Successfully played a card hand";
		return (status);
	}

	public reset() {
		this.cards.length = 0;
	}
}