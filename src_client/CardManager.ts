import * as THREE from 'three';
import { Card } from './Card.ts';
import { CardHand } from './CardHand.ts';

export class CardManager {
	private	pointLeft: THREE.Vector3;
	private pointRight: THREE.Vector3;
	private	slots: Array<THREE.Vector3>;
	private cards: Array<Card>;
	private selectedCards: CardHand;
	
	constructor(pointLeft: THREE.Vector3, pointRight: THREE.Vector3) {
		this.slots = [];
		this.cards = [];
		this.selectedCards = new CardHand();
		this.pointLeft = pointLeft;
		this.pointRight = pointRight;
	}

	public receiveCard(card: Card) {
		this.cards.push(card);
		this.calculateSlots();
		this.updateSlots();
	}

	public removeCard(card: Card) {
		let index = this.cards.indexOf(card);
		if (index == -1) {
			console.log('Card to remove not found');
			return ;
		}
		this.cards.splice(index, 1);
		this.calculateSlots();
		this.updateSlots();
	}

	private	calculateSlots() {
		this.slots.length = 0;
		const amountOfDistances = this.cards.length - 1;
		const distX = Math.abs(this.pointRight.x - this.pointLeft.x);
		const iteration = distX / amountOfDistances;
		for (let x = this.pointLeft.x; x <= this.pointRight.x; x += iteration) {
			this.slots.push(new THREE.Vector3(x, this.pointLeft.y, 0));
		}
	}

	private updateSlots() {
		for (let i = 0; i < this.cards.length; i++)
		{
			let card = this.cards.at(i);
			let slot = this.slots.at(i);
			if (card && slot) {
				card.object.position.set(slot.x, slot.y, slot.z);
			}
		}
	}

	// update card position via slot for selected card
	public selectCard(raycaster: THREE.Raycaster) {
		let cardObjects = Card.getCardObjects(this.cards);
		let cardHandObjects = Card.getCardObjects(this.selectedCards.cards);
		let intersected = raycaster.intersectObjects(cardObjects.concat(cardHandObjects));
		if (intersected.length > 0) {
			let card: Card = intersected[0].object.userData.instance;
			if (card && this.cards.indexOf(card) != -1) {
				this.cards.splice(this.cards.indexOf(card), 1);
				this.selectedCards.receiveCard(card);
				console.log(`card selected: ${card.rank}, ${card.suite}`);
			}
			else if (card && this.selectedCards.cards.indexOf(card) != -1) {
				this.selectedCards.removeCard(card);
				this.cards.push(card);
				console.log(`Card deselected: ${card.rank}, ${card.suite}`);
			}
		}
	}

	// transmit to server
	public selectedCardsToJSON(): string {
		return (JSON.stringify(this.selectedCards));
	}
}