import { io, Socket } from 'socket.io-client';
import * as THREE from 'three';
import { CardManager } from './CardManager.ts';
import { CardHeap } from './CardHeap.ts';
import { Card } from './Card.ts';
import { scene } from './main.ts';
import { CardHandTransmit, ReconnectTransmit } from '../src_shared/Types.ts';
import { CardHand } from './CardHand.ts';

export class Opponent {
	private socket: Socket;
	private opponentId: string;
	private cardHeapRef: CardHeap;
	public	cardManager: CardManager;

	constructor(socket: Socket, opponentId: string, cardHeapRef: CardHeap) {
		this.socket = socket;
		this.opponentId = opponentId;
		this.cardHeapRef = cardHeapRef;
		this.cardManager = new CardManager(this.opponentId);

		console.log(`opponent<${this.opponentId}> joined`);

		this.socket.on("opponent_collect_cards", (opponentCardsAmountJSON) => {
			const opponentCardsAmount: Record<string, number> = JSON.parse(opponentCardsAmountJSON);
			const amount = opponentCardsAmount[this.opponentId];
			this.collectCardsAmount(amount);
		});

		this.socket.on("opponent_play_card_hand", (cardHandTransmitJSON) => {
			const cardHandTransmit = JSON.parse(cardHandTransmitJSON) as CardHandTransmit;
			console.log(`opponent_play_card_hand: cardhand id: ${cardHandTransmit.playerId} my id:${this.opponentId}`)
			if (cardHandTransmit.playerId === this.opponentId) {
				const cardHand = new CardHand(this.opponentId);
				for (let i = 0; i < cardHandTransmit.cards.length; i++) {
					let card = this.cardManager.removeCardByIndex(0);
					if (card)  {
						card.setCardRankSuite(cardHandTransmit.cards[i].rank, cardHandTransmit.cards[i].suite);
						cardHand.receiveCard(card);
					}
				}
				this.cardHeapRef.receiveCardHand(cardHand);
			}
		});

		this.socket.on("player_reconnect", (gameStateJSON) => {
			const gameState = JSON.parse(gameStateJSON) as ReconnectTransmit;

			const cardsAmount = gameState.playerCardsAmount[this.opponentId];
			this.collectCardsAmount(cardsAmount);
		});
	}

	private collectCardsAmount(amount: number) {
		if (amount > 0) {
			for (let i = 0; i < amount; i++) {
				const card = new Card(0, 0);
				this.cardManager.receiveCard(card);
			}
		}
	}
}