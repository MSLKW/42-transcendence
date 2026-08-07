import * as THREE from 'three';
import { GameStateTransmit, CardRank } from '@bigtwo/shared';
import { Card } from './Card.ts';
import { gsap, shuffle } from 'gsap';

export class Deck {
	private cards: Array<Card>;
	private slots: Array<THREE.Vector3>;
	private position: THREE.Vector3;
	private rotation: THREE.Euler;
	private yOffset: number;
	private yStep: number;
	private playerCardsAmount: number;
	private opponentCardsAmount: number;
	private totalOpponents: number;

	constructor(position: THREE.Vector3) {
		this.cards = [];
		this.slots = [];
		this.playerCardsAmount = 0;
		this.opponentCardsAmount = 0;
		this.totalOpponents = 0;
		this.position = position;
		this.rotation = new THREE.Euler(Math.PI / 2, 0, 0);
		this.yOffset = 0;
		this.yStep = 0.005;
	}

	public initCards(gameState: GameStateTransmit, playerId: string) {
		for (let i = 0; i < gameState.playerCards.length; i++) {
			let playerCard = new Card(gameState.playerCards[i].rank, gameState.playerCards[i].suit);
			this.receiveCard(playerCard);
		}
		this.playerCardsAmount = gameState.playerCards.length;
		for (const [uuid, cardsAmount] of Object.entries(gameState.playerCardsAmount)) {
			if (uuid !== playerId) {
				for (let i = 0; i < cardsAmount; i++) {
					let opponentCard = new Card(CardRank.Unknown, 0);
					this.receiveCard(opponentCard);
				}
				this.opponentCardsAmount += cardsAmount;
				this.totalOpponents += 1;
			}
		}
	}

	private receiveCard(card: Card) {
		this.cards.push(card);
		const slot = new THREE.Vector3(this.position.x, this.position.y + this.yOffset, this.position.z);
		this.slots.push(slot);
		card.object.position.copy(slot);
		card.object.rotation.copy(this.rotation);
		this.yOffset += this.yStep;
	}

	private updateCardObjects(duration: number): gsap.core.Timeline {
		const timeline = gsap.timeline();
		for (let i = 0; i < this.cards.length; i++) {
			if (this.cards[i].object.position !== this.slots[i]) {
				timeline.add(this.cards[i].move(this.slots[i], this.cards[i].object.quaternion, duration), 0);
			}
		}
		return (timeline)
	}

	public toTop(index: number, amount: number = 1, duration: number = 0.4 ): gsap.core.Timeline {
		const timeline = gsap.timeline();
		const cardsRemoved: Array<Card> = this.cards.splice(index, amount);
		if (cardsRemoved.length === 0) {
			return (timeline);
		}
		for (let i = 0; i < cardsRemoved.length; i++) {
			const cardTimeline = gsap.timeline();
			const card = cardsRemoved[i];
			const toSide = this.slots[index + i].clone();
			toSide.x += 1.25;
			const targetSlot = this.slots[this.slots.length - cardsRemoved.length + i];
			const toTop = toSide.clone();
			toTop.y = targetSlot.y;
			cardTimeline.add(card.move(toSide, card.object.quaternion, duration / 4));
			cardTimeline.add(this.updateCardObjects(duration / 4));
			cardTimeline.add(card.move(toTop, card.object.quaternion, duration / 4));
			cardTimeline.add(card.move(targetSlot, card.object.quaternion, duration / 4));
			timeline.add(cardTimeline, 0);
		}
		this.cards.push(...cardsRemoved);
		return (timeline);
	}

	// Requires the deck to start with player cards and then opponent cards stacked on top, maybe make it independent?
	public shuffleAnimation(duration: number): gsap.core.Timeline {
		const shuffleTimeline = gsap.timeline();
		if (this.playerCardsAmount > 0) {
			const miniDuration = duration / (this.playerCardsAmount * 2);
			for (let i = 0; i < this.playerCardsAmount; i++) {
				shuffleTimeline.add(this.toTop(this.playerCardsAmount - i, this.totalOpponents, miniDuration));
				shuffleTimeline.add(this.toTop(0, 1, miniDuration));
			}
		}
		else {
			const cycles = this.opponentCardsAmount / this.totalOpponents;
			for (let i = 0; i < cycles; i++)
			shuffleTimeline.add(this.toTop(0, this.totalOpponents, duration / cycles));
		}
		return (shuffleTimeline);
	}

	public dealTopCards(amount: number = 1): Array<Card> {
		return (this.cards.splice(this.cards.length - 1, amount));
	}
}