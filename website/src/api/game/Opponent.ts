import { Socket } from 'socket.io-client';
import { CardHeap } from './CardHeap';
import { Card } from './Card';
import { CardRank, type CardHandTransmit, type GameStateTransmit } from '@big2/game-types';
import { CardHand } from './CardHand';
import { Participant } from './Participant';
import { useGameStore } from '../../store/GameStore';

export class Opponent extends Participant {

	constructor(socket: Socket, uuid: string, cardHeapRef: CardHeap) {
		super(socket, uuid, cardHeapRef);

		this.socket.on("player_play_card_hand", (cardHandTransmit: CardHandTransmit) => {
			if (cardHandTransmit.playerId === this.uuid) {
				const cardHand = new CardHand(this.uuid);
				for (let i = 0; i < cardHandTransmit.cards.length; i++) {
					const [card, animation] = this.cardManager.removeCardByIndex(0);
					if (card)  {
						card.setCardRankSuit(cardHandTransmit.cards[i].rank, cardHandTransmit.cards[i].suit);
						cardHand.receiveCard(card);
					}
					if (animation !== undefined) {
						this.cardHeapRef.cardHandQueue.add(animation);
					} 
				}
				this.cardHeapRef.cardHandQueue.add(this.cardHeapRef.receiveCardHand(cardHand));
				useGameStore.getState().reduceCardsLeft(this.uuid, cardHand.cards.length);
			}
		});
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