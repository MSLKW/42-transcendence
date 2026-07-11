import { Socket } from 'socket.io';
import { CardTransmit, CardRank, CardSuit, CardHandTransmit, HandType, PentupleType, statusTransmit as StatusTransmit } from '../src_shared/Types.js';
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
	public	isDisconnected: boolean;

	constructor(playerId: string, socket: Socket, gameState: GameState) {
		this.playerId = playerId;
		this.cards = [];
		this.socket = socket;
		this.gameStateRef = gameState;
		this.cardHeapRef = gameState.cardHeap;
		this.isDisconnected = false;

		this.setupSocketListeners()
	}

	public setupSocketListeners() {
		this.socket.on("player_play_card_hand", (cardHandTransmit: CardHandTransmit) => {
			const status: StatusTransmit = this.playCardHand(cardHandTransmit);
			this.socket.emit('player_play_card_hand', status);
			if (status.success === true) {
				if (this.cards.length === 0) {
					this.gameStateRef.endGame(this)
					return ;
				}
				this.gameStateRef.nextPlayerTurn();
			}
		});

		this.socket.on("player_skip_turn", () => {
			this.socket.emit("player_skip_turn", this.skipTurn());
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

	public skipTurn(): StatusTransmit {
		const status: StatusTransmit = {
			success: false,
			message: "It's not the player's turn"
		}
		if (this.gameStateRef.isPlayerTurn(this) === false) {
			return (status);
		}
		if (this.cardHeapRef.isPlayerLeading(this.playerId)) {
			status.message = "Player is already leading"
			return (status);
		}
		this.gameStateRef.nextPlayerTurn();
		status.success = true;
		status.message = "Player has successfully skipped their turn";
		return (status);
	}

	public forceSkipTurn() {
		if (this.cardHeapRef.isPlayerLeading(this.playerId))
			this.cardHeapRef.resetPlayerLeading();
		this.cardHeapRef.requiresThreeDiamonds = false;
		this.gameStateRef.nextPlayerTurn();
	}

	// Returns if player has finished all his cards
	private playCardHand(cardHandTransmit: CardHandTransmit): StatusTransmit {
		const status: StatusTransmit = {
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
		// need to fix it so that if a three diamonds player disconnect, then the next player can play anything instead of soft locked
		if (this.cardHeapRef.requiresThreeDiamonds === true && PlayerState.hasThreeDiamonds(cardHand.cards) === false) {
			status.message = "first cardhand played must contain three of diamonds";
			return (status);
		}
		if (this.cardHeapRef.isCardHandPlayable(cardHand) == false) {
			status.message = "cardhand is not playable";
			return (status);
		}
		this.cardHeapRef.receiveCardHand(cardHand);
		this.removeCards(cardHand.cards);

		status.success = true;
		status.message = "Successfully played a card hand";
		return (status);
	}

	public calculatePenaltyPoints() {
		let penaltyPoints: number = 0;
		const cardAmount = this.cards.length;

		if (cardAmount <= 9) {
			penaltyPoints = cardAmount;
		}
		else if (cardAmount > 9 && cardAmount < 13) {
			penaltyPoints = cardAmount * 2;
		}
		else if (cardAmount > 13) {
			penaltyPoints = cardAmount * 3;
		}
		return (penaltyPoints);
	}

	public reset() {
		this.cards.length = 0;
	}
}