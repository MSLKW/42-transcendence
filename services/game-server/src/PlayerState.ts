import { Socket } from 'socket.io';
import { CardTransmit, CardRank, CardSuit, CardHandTransmit, HandType, PentupleType, StatusTransmit, SkipTurnTransmit } from '@big2/game-types';
import { GameState } from './GameState.js';
import { CardHeapState } from './CardHeapState.js';
import { io } from './server.js';
import { CardHandState } from './CardHandState.js';
import { UserState } from './UserState.js';

export class PlayerState {
	public	socket: Socket;
	public	uuid: string;
	public	cards: Array<CardTransmit>;
	private gameStateRef: GameState;
	private cardHeapRef: CardHeapState;
	public	isDisconnected: boolean;

	constructor(uuid: string, socket: Socket, gameState: GameState) {
		this.uuid = uuid;
		this.cards = [];
		this.socket = socket;
		this.gameStateRef = gameState;
		this.cardHeapRef = gameState.cardHeap;
		this.isDisconnected = false;

		this.setupSocketListeners()
	}

	public setupSocketListeners() {
		this.socket.join(this.gameStateRef.gameRoomId);

		this.socket.on("player_play_card_hand_request", (cardHandTransmit: CardHandTransmit) => {
			const status: StatusTransmit = this.playCardHand(cardHandTransmit);
			this.socket.emit("player_play_card_hand_request", status);
			if (status.success === true) {
				if (this.cards.length === 0) {
					this.gameStateRef.endGame(this)
					return ;
				}
				this.gameStateRef.nextPlayerTurn();
			}
		});

		this.socket.on("player_skip_turn_request", () => {
			this.socket.emit("player_skip_turn_request", this.skipTurnRequest());
		})
	}

	public disconnect() {
		this.isDisconnected = true;
		if (this.gameStateRef.settings.autoPassInMilliseconds === 0)
			this.skipTurn();
		console.log(`Player<${this.uuid}> has disconnected`)
	}

	public reconnect(user: UserState) {
		this.socket = user.socket;
		this.isDisconnected = false;
		this.setupSocketListeners();
		this.socket.emit("game_state", this.gameStateRef.transmit(this));
		console.log(`Player<${user.uuid}> has reconnected`);
	}

	public collectCards(cards: Array<CardTransmit>) {
		for (let i = 0; i < cards.length; i++) {
			this.cards.push(cards[i]);
		}
	}

	public static hasCard(cards: Array<CardTransmit>, rank: CardRank, suit: CardSuit): boolean {
		const card = cards.find((card) => card.rank === rank && card.suit === suit);
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

	public skipTurnRequest(): StatusTransmit {
		const status: StatusTransmit = {
			success: false,
			message: "It's not the player's turn"
		}
		if (this.gameStateRef.isPlayerTurn(this) === false) {
			return (status);
		}
		if (this.cardHeapRef.isPlayerLeading(this.uuid)) {
			status.message = "Player is already leading"
			return (status);
		}
		this.skipTurn();
		status.success = true;
		status.message = "Player has successfully skipped their turn";
		return (status);
	}

	public skipTurn() {
		if (this.gameStateRef.isPlayerTurn(this) === true) {
			if (this.cardHeapRef.isPlayerLeading(this.uuid))
				this.cardHeapRef.resetPlayerLeading();
			this.cardHeapRef.requiresThreeDiamonds = false;
			const playerSkipTurn: SkipTurnTransmit = {
				playerId: this.uuid
			}
			this.gameStateRef.emit("player_skip_turn", playerSkipTurn);
			this.gameStateRef.nextPlayerTurn();
		}
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
		if (this.cardHeapRef.requiresThreeDiamonds === true && PlayerState.hasCard(cardHand.cards, CardRank.Three, CardSuit.Diamond) === false) {
			status.message = "first cardhand played must contain three of diamonds";
			return (status);
		}
		if (this.cardHeapRef.isCardHandPlayable(cardHand) == false) {
			status.message = "cardhand is not playable";
			return (status);
		}
		this.cardHeapRef.receiveCardHand(cardHand);
		this.gameStateRef.emit("player_play_card_hand", cardHand.transmit());
		this.removeCards(cardHand.cards);

		status.success = true;
		status.message = "Successfully played a card hand";
		return (status);
	}

	public calculatePenaltyPoints(): number {
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