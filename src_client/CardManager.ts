import * as THREE from 'three';
import { Card } from './Card.ts';
import { CardHand } from './CardHand.ts';

export class CardManager {
	private position: THREE.Vector3;
	private rotation: THREE.Euler;
	private boundSpace: number;
	private	slots: Array<THREE.Vector3>; // Relative to the object position
	private cards: Array<Card>;
	private	selectedCards: CardHand;
	private selectedBoundSpace: number;
	private selectedSlots: Array<THREE.Vector3>;
	private playerId: string;
	
	constructor(position: THREE.Vector3, rotation: THREE.Euler, boundSpace: number, selectedBoundSpace: number, playerId: string) {
		this.position = position;
		this.rotation = rotation;
		this.slots = [];
		this.cards = [];
		this.playerId = playerId
		this.selectedCards = new CardHand(this.playerId);
		this.boundSpace = boundSpace;
		this.selectedBoundSpace = selectedBoundSpace;
		this.selectedSlots = [];
	}

	public receiveCard(card: Card) {
		this.cards.push(card);
		this.slots = this.calculateSlots(this.cards, this.boundSpace);
		this.updateCardPositions(this.cards, this.slots);
	}

	public removeCard(card: Card) {
		let index = this.cards.indexOf(card);
		if (index == -1) {
			console.log('Card to remove not found');
			return ;
		}
		this.cards.splice(index, 1);
		this.slots = this.calculateSlots(this.cards, this.boundSpace);
		this.updateCardPositions(this.cards, this.slots);
	}

	// very prone to breaking lol, gotta revamp
	private	calculateSlots(cards: Array<Card>, boundSpace: number, offset?: THREE.Vector3): Array<THREE.Vector3> {
		if (offset === undefined)
			offset = new THREE.Vector3(0, 0, 0);
		const slots: Array<THREE.Vector3> = [];
		const leftBound = -(boundSpace / 2)
		const rightBound = boundSpace / 2
		const amountOfDistances = Math.max(0, cards.length - 1);
		const distX = Math.abs(rightBound - leftBound);
		const iteration = distX / amountOfDistances;
		for (let x = leftBound; x <= rightBound; x += iteration) {
			const slot = new THREE.Vector3(this.position.x + offset.x + x, this.position.y + offset.y, this.position.z + offset.z);
			slots.push(this.rotateAroundPivot(slot, this.position, this.rotation));
		}
		return (slots)
	}

	private rotateAroundPivot(position: THREE.Vector3, pivot: THREE.Vector3, rotation: THREE.Euler) {
		return (new THREE.Vector3().copy(position).sub(pivot).applyEuler(rotation).add(pivot));
	}

	private updateCardPositions(cards: Array<Card>, slots: Array<THREE.Vector3>) {
		for (let i = 0; i < cards.length; i++)
		{
			let card = cards.at(i);
			let slot = slots.at(i);
			if (card && slot) {
				card.object.position.copy(slot);
				card.object.rotation.copy(this.rotation);
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
			this.selectedSlots = this.calculateSlots(this.selectedCards.cards, this.selectedBoundSpace, new THREE.Vector3(0, 2, 0));
			this.updateCardPositions(this.selectedCards.cards, this.selectedSlots);
			// card.object.position.setY(card.object.position.y + 2);
		}
	}

	private deselectCard(card: Card) {
		if (this.selectedCards.removeCard(card)) {
			this.receiveCard(card);
			console.log(`Card deselected: ${card.rank}, ${card.suite}`);
			this.selectedSlots = this.calculateSlots(this.selectedCards.cards, this.selectedBoundSpace, new THREE.Vector3(0, 2, 0));
			this.updateCardPositions(this.selectedCards.cards, this.selectedSlots);
		}
	}

	// transmit to server
	public selectedCardsToJSON(): string {
		return (JSON.stringify(this.selectedCards));
	}

	public sendSelectedCards(): CardHand {
		const cardHand = this.selectedCards;
		this.selectedCards = new CardHand(this.playerId);
		return (cardHand);
	}
}