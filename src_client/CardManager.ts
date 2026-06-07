import * as THREE from 'three';
import { Card } from './Card.ts';
import { CardHand } from './CardHand.ts';

export class CardManager {
	private	pointLeft: THREE.Vector3;
	private pointRight: THREE.Vector3;
	private	slots: Array<THREE.Vector3>;
	private cards: Array<Card>;
	private	selectedCards: CardHand;
	private selectedPointLeft: THREE.Vector3;
	private selectedPointRight: THREE.Vector3;
	private selectedSlots: Array<THREE.Vector3>;
	private playerId: string;
	
	constructor(pointLeft: THREE.Vector3, pointRight: THREE.Vector3, selectedPointLeft: THREE.Vector3, selectedPointRight: THREE.Vector3, playerId: string) {
		this.slots = [];
		this.cards = [];
		this.playerId = playerId
		this.selectedCards = new CardHand(this.playerId);
		this.pointLeft = pointLeft;
		this.pointRight = pointRight;
		this.selectedPointLeft = selectedPointLeft;
		this.selectedPointRight = selectedPointRight;
		this.selectedSlots = [];
	}

	public receiveCard(card: Card) {
		this.cards.push(card);
		this.slots = this.calculateSlots(this.cards, this.pointLeft, this.pointRight);
		this.updateCardPositions(this.cards, this.slots);
	}

	public removeCard(card: Card) {
		let index = this.cards.indexOf(card);
		if (index == -1) {
			console.log('Card to remove not found');
			return ;
		}
		this.cards.splice(index, 1);
		this.slots = this.calculateSlots(this.cards, this.pointLeft, this.pointRight);
		this.updateCardPositions(this.cards, this.slots);
	}

	// very prone to breaking lol, gotta revamp
	private	calculateSlots(cards: Array<Card>, pointLeft: THREE.Vector3, pointRight: THREE.Vector3): Array<THREE.Vector3> {
		const slots: Array<THREE.Vector3> = [];
		const amountOfDistances = Math.max(0, cards.length - 1);
		const distX = Math.abs(pointRight.x - pointLeft.x);
		const iteration = distX / amountOfDistances;
		for (let x = pointLeft.x; x <= pointRight.x; x += iteration) {
			slots.push(new THREE.Vector3(x, pointLeft.y, 0));
		}
		return (slots)
	}

	private updateCardPositions(cards: Array<Card>, slots: Array<THREE.Vector3>) {
		for (let i = 0; i < cards.length; i++)
		{
			let card = cards.at(i);
			let slot = slots.at(i);
			if (card && slot) {
				card.object.position.set(slot.x, slot.y, slot.z);
			}
		}
	}

	// update card position via slot for selected card
	public interactCard(raycaster: THREE.Raycaster) {
		let cardObjects = Card.getCardObjects(this.cards);
		let cardHandObjects = Card.getCardObjects(this.selectedCards.cards);
		let intersected = raycaster.intersectObjects(cardObjects.concat(cardHandObjects));
		if (intersected.length > 0) {
			let card: Card = intersected[0].object.userData.instance;
			if (card && this.cards.indexOf(card) != -1) {
				this.selectCard(card);
			}
			else if (card && this.selectedCards.cards.indexOf(card) != -1) {
				this.deselectCard(card);
			}
		}
	}

	private	selectCard(card: Card) {
		if (this.selectedCards.receiveCard(card) == true) {
			console.log(`card selected: ${card.rank}, ${card.suite}`);
			this.removeCard(card);
			this.selectedSlots = this.calculateSlots(this.selectedCards.cards, this.selectedPointLeft, this.selectedPointRight);
			this.updateCardPositions(this.selectedCards.cards, this.selectedSlots);
			// card.object.position.setY(card.object.position.y + 2);
		}
	}

	private deselectCard(card: Card) {
		if (this.selectedCards.removeCard(card)) {
			this.receiveCard(card);
			console.log(`Card deselected: ${card.rank}, ${card.suite}`);
			this.selectedSlots = this.calculateSlots(this.selectedCards.cards, this.selectedPointLeft, this.selectedPointRight);
			this.updateCardPositions(this.selectedCards.cards, this.selectedSlots);
		}
	}

	// transmit to server
	public selectedCardsToJSON(): string {
		return (JSON.stringify(this.selectedCards));
	}

	public sendSelectedCards(): CardHand {
		const cardHand = this.selectedCards;
		// for (let i = 0; i < this.selectedCards.cards.length; i++) {
			this.selectedCards = new CardHand(this.playerId);
		// }
		return (cardHand);
	}
}