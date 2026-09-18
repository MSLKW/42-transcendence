import * as THREE from 'three';
import { gsap } from 'gsap';
import { CardHand } from './CardHand.ts';
import { CardHandTransmit } from '@big2/game-types';
import { Card } from './Card.ts';

export class CardHeap {
	public	cardHandQueue: gsap.core.Timeline;
	public	originalPosition: THREE.Vector3;
	private position: THREE.Vector3;
	private rotation: THREE.Euler;
	private cardHands: Array<CardHand>;

	constructor(position: THREE.Vector3) {
		this.originalPosition = position;
		this.position = this.originalPosition;
		this.rotation = new THREE.Euler(-Math.PI / 2, 0, this.getRandomRange(-0.3, 0.3));
		this.cardHands = [];
		this.cardHandQueue = gsap.timeline({ paused: true });
	}

	private getRandomRange(min: number, max: number) {
		return (Math.random() * (max - min) + min);
	}

	public receiveCardHand(cardHand: CardHand): gsap.core.Timeline {
		if (this.cardHands.length > 0) {
			const cards = this.cardHands[this.cardHands.length - 1].cards;
			for (let i = 0; i < cards.length; i++) {
				cards[i].dim();
			}
		}
		this.cardHands.push(cardHand);
		const timeline = this.updateCardHandObjects(cardHand);
		this.position.y += 0.02;
		this.position.x = this.getRandomRange(-0.3, 0.3);
		this.position.z = this.getRandomRange(-0.3, 0.3);
		this.rotation.z = this.getRandomRange(-0.3, 0.3);
		return (timeline);
	}

	// copied logic from CardManager.ts
	private updateCardHandObjects(cardHand: CardHand): gsap.core.Timeline {
		const timeline = gsap.timeline();
		const cards = cardHand.cards;
		const fanRotation = 30;
		const boundSpace = (cards.length - 1) * Card.Width / 3;
		const fanHeight = boundSpace / 2 * Math.tan((fanRotation * Math.PI / 180) / 4);
		const leftBound = -(boundSpace / 2);
		const rightBound = boundSpace / 2;
		for (let i = 0; i < cards.length; i++) {
			let normalizedIndex = cards.length > 1 ? i / (cards.length - 1) : 0.5;
			let x = THREE.MathUtils.lerp(leftBound, rightBound, normalizedIndex);
			const position = new THREE.Vector3(this.position.x + x, this.position.y, this.position.z);

			const fanRotationStart = (fanRotation / 2) * (Math.PI / 180);
			const fanRotationEnd = -(fanRotation / 2) * (Math.PI / 180);
	
			const fanPositionValley = -(fanHeight / 2);
			const fanPositionPeak = fanHeight / 2;
	
			const rotation = new THREE.Quaternion().setFromEuler(this.rotation);
			rotation.multiply(
				new THREE.Quaternion().setFromAxisAngle(
					new THREE.Vector3(0, 0, 1), 
					THREE.MathUtils.lerp(fanRotationStart, fanRotationEnd, normalizedIndex))
			);
			position.add(new THREE.Vector3(
					0, 
					THREE.MathUtils.lerp(fanPositionValley, fanPositionPeak, Math.sin(normalizedIndex * Math.PI)), 
					THREE.MathUtils.lerp(0, 0.01, normalizedIndex)
				).applyQuaternion(rotation)
			);
			timeline.add(cards[i].move(position, rotation), 0);
		}
		return (timeline);
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
		this.cardHandQueue.kill();
		this.cardHandQueue = gsap.timeline({ paused: true });
	}
}