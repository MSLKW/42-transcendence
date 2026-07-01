import * as THREE from 'three';
import { CardHand } from './CardHand.ts';
import { CardHandTransmit } from '../src_shared/Types.ts';
import { Card } from './Card.ts';

export class CardHeap {
	private originalPosition: THREE.Vector3;
	private position: THREE.Vector3;
	private cardHands: Array<CardHand>;

	constructor(position: THREE.Vector3) {
		this.originalPosition = position;
		this.position = this.originalPosition;
		this.cardHands = [];
	}

	public receiveCardHand(cardHand: CardHand) {
		this.cardHands.push(cardHand);
		this.updateCardHandObject(cardHand);
		this.position.y += 0.01;
	}

	private updateCardHandObject(cardHand: CardHand) {
		let xStart = -2.5;
		let xEnd = 2.5;
		for (let i = 0; i < cardHand.cards.length; i++) {
			let normalizedIndex = cardHand.cards.length > 1 ? i / (cardHand.cards.length - 1) : 0.5;
			cardHand.cards[i].object.rotation.set(-Math.PI / 2, 0, 0);
			cardHand.cards[i].object.position.set(this.position.x + THREE.MathUtils.lerp(xStart, xEnd, normalizedIndex), this.position.y, this.position.z);
		}
	}

	public sync(cardHands: Array<CardHandTransmit>) {
		for (let i = 0; i < cardHands.length; i++) {
			let cardHand = new CardHand(cardHands[i].playerId);
			for (let j = 0; j < cardHands[i].cards.length; j++) {
				let cardTransmit = cardHands[i].cards[j]
				const card = new Card(cardTransmit.rank, cardTransmit.suit);
				cardHand.receiveCard(card);
			}
			this.receiveCardHand(cardHand);
		}
	}

	public reset() {
		for (let i = 0; i < this.cardHands.length; i++) {
			this.cardHands[i].disposeCards();
		}
		this.cardHands.length = 0;
		this.position = this.originalPosition;
	}
}