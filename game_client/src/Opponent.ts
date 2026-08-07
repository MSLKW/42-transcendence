import { io, Socket } from 'socket.io-client';
import * as THREE from 'three';
import { CardManager } from './CardManager.ts';
import { CardHeap } from './CardHeap.ts';
import { Card } from './Card.ts';
import { scene } from './main.ts';
import { CardRank, CardHandTransmit, GameEndStatsTransmit, GameStateTransmit } from '@big2/game-types';
import { CardHand } from './CardHand.ts';
import { Participant } from './Participant.ts';

export class Opponent extends Participant {

	constructor(socket: Socket, uuid: string, cardHeapRef: CardHeap) {
		super(socket, uuid, cardHeapRef);

		this.socket.on("player_play_card_hand", (cardHandTransmit: CardHandTransmit) => {
			if (cardHandTransmit.playerId === this.uuid) {
				const cardHand = new CardHand(this.uuid);
				for (let i = 0; i < cardHandTransmit.cards.length; i++) {
					let [card, animation] = this.cardManager.removeCardByIndex(0);
					if (card)  {
						card.setCardRankSuit(cardHandTransmit.cards[i].rank, cardHandTransmit.cards[i].suit);
						cardHand.receiveCard(card);
					}
					if (animation !== undefined) {
						this.cardHeapRef.cardHandQueue.add(animation);
					} 
				}
				this.cardHeapRef.cardHandQueue.add(this.cardHeapRef.receiveCardHand(cardHand));
			}
		});

		this.socket.on("game_end", (gameEndStats: GameEndStatsTransmit) => {
			this.cardManager.reset();
		})
	}

	public override sync(gameState: GameStateTransmit) {
		this.collectCardsAmount(gameState.playerCardsAmount[this.uuid]);
	}

	private collectCardsAmount(amount: number) {
		for (let i = 0; i < amount; i++) {
			const card = new Card(CardRank.Unknown, 0);
			this.cardManager.receiveCard(card);
		}
	}
}