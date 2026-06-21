import * as THREE from 'three';
import { CardHand } from './CardHand.ts';

export class CardHeap {
	private position: THREE.Vector3;
	private cardHands: Array<CardHand>;
	// some pos for card to be stacked ontop of
	// 
	constructor(position: THREE.Vector3) {
		this.position = position;
		this.cardHands = [];
	}

	public receiveCardHand(cardHand: CardHand) {
		this.cardHands.push(cardHand);
		let xOffset = -2;
		for (let i = 0; i < cardHand.cards.length; i++) {
			cardHand.cards[i].object.rotation.set(-Math.PI / 2, 0, 0);
			cardHand.cards[i].object.position.set(this.position.x + xOffset, this.position.y, this.position.z);
			xOffset++;
		}
		this.position.y += 0.01;
	}
}