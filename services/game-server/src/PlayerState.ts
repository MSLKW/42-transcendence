import { Socket } from 'socket.io';
import { CardTransmit, CardRank, CardSuit, CardHandTransmit, HandType, PentupleType, StatusTransmit, SkipTurnTransmit } from '@big2/game-types';
import { GameState } from './GameState.js';
import { CardHeapState } from './CardHeapState.js';
import { io } from './server.js';
import { CardHandState } from './CardHandState.js';
import { UserState } from './UserState.js';
import { EventEmitter } from 'node:stream';

export class PlayerState {
	public	socket: Socket;
	public	uuid: string;
	public	cards: Array<CardTransmit>;
	private gameEvents: EventEmitter;
	private cardHeapRef: CardHeapState;
	public	isDisconnected: boolean;

	public	isMyTurn: boolean;
	public	playedTwoSpadesLast: boolean;

	// inject gameRoomId
	constructor(uuid: string, socket: Socket, gameEvents: EventEmitter, cardHeap: CardHeapState) {
		this.uuid = uuid;
		this.cards = [];
		this.socket = socket;
		this.gameEvents = gameEvents;
		this.cardHeapRef = cardHeap;
		this.isDisconnected = false;
		this.isMyTurn = false;
		this.playedTwoSpadesLast = false;

		this.setupSocketListeners()
	}

	public setupSocketListeners() {
		this.socket.on("player_play_card_hand_request", this.playCardHandRequest);
		this.socket.on("player_skip_turn_request", this.skipTurnRequest);
	}

	public disconnect(gameRef: GameState) {
		this.isDisconnected = true;
		if (gameRef.settings.autoPassInMilliseconds === 0)
			this.skipTurn();
		console.log(`Player<${this.uuid}> has disconnected`)
	}

	public reconnect(user: UserState, gameRef: GameState) {
		this.socket = user.socket;
		this.isDisconnected = false;
		this.setupSocketListeners();
		this.socket.emit("game_state", gameRef.transmit(this));
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

	public skipTurnRequest = (statusCallback: (status: StatusTransmit) => void) => {
		const status: StatusTransmit = {
			success: false,
			message: "It's not the player's turn"
		}
		if (this.isMyTurn === false) {
			statusCallback(status);
			return ;
		}
		if (this.cardHeapRef.isPlayerLeading(this.uuid)) {
			status.message = "Player is already leading";
			statusCallback(status);
			return ;
		}
		this.skipTurn();
		status.success = true;
		status.message = "Player has successfully skipped their turn";
		statusCallback(status);
	}

	public skipTurn() {
		if (this.isMyTurn === true) {
			if (this.cardHeapRef.isPlayerLeading(this.uuid))
				this.cardHeapRef.resetPlayerLeading();
			this.cardHeapRef.requiresLowestCard = false;
			const playerSkipTurn: SkipTurnTransmit = {
				playerId: this.uuid
			}
			this.gameEvents.emit("player:skip_turn", playerSkipTurn);
		}
	}

	// Returns if player has finished all his cards
	public playCardHandRequest = (cardHandTransmit: CardHandTransmit, statusCallback: (status: StatusTransmit) => void) => {
		const status: StatusTransmit = {
			success: false,
			message: ""
		};
		if (this.isMyTurn === false) {
			status.message = "Not your turn";
			statusCallback(status);
			return ;
		}
		const cardHand = new CardHandState(cardHandTransmit.cards, cardHandTransmit.playerId);
		if (cardHand.compareTypes(cardHandTransmit) === false) {
			status.message = "handtype or pentuple type send by client is inaccurate";
			statusCallback(status);
			return ;
		}
		if (cardHand.handType === HandType.None || (cardHand.handType === HandType.Pentuple && cardHand.pentupleType === PentupleType.None)) {
			status.message = "cardhand is not even a thing";
			statusCallback(status);
			return ;
		}
		for (let i = 0; i < cardHand.cards.length; i++) {
			if (this.cards.findIndex((card: CardTransmit) => card.rank === cardHand.cards[i].rank && card.suit === cardHand.cards[i].suit ) == -1) {
				status.message = "cardhand cards not in playerState cards";
				statusCallback(status);
				return ;
			}
		}
		if (this.cardHeapRef.checkLowestCardRequirement(cardHand)) {
			status.message = "first cardhand played must contain your lowest card";
			statusCallback(status);
			return ;
		}
		if (this.cardHeapRef.isCardHandPlayable(cardHand) == false) {
			status.message = "cardhand is not playable";
			statusCallback(status);
			return ;
		}
		this.cardHeapRef.receiveCardHand(cardHand);
		this.removeCards(cardHand.cards);
		
		status.success = true;
		status.message = "Successfully played a card hand";
		statusCallback(status);
		this.gameEvents.emit("player:play_card_hand", cardHand.transmit());
	}

	public calculatePenaltyPoints(): number {
		let penaltyPoints: number = 0;
		const cardAmount = this.cards.length;
		
		if (this.playedTwoSpadesLast === true) {
			penaltyPoints = 99;
			return (penaltyPoints);
		}
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
		// this.isDisconnected = false;
		this.isMyTurn = false;
		this.playedTwoSpadesLast = false;
		this.socket.off("player_play_card_hand_request", this.playCardHandRequest);
		this.socket.off("player_skip_turn_request", this.skipTurnRequest);
	}
}