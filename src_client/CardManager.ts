import * as THREE from 'three';
import { Card } from './Card.ts';
import { CardHand } from './CardHand.ts';

export class CardManager {
	private position: THREE.Vector3;
	private rotation: THREE.Euler;
	private boundSpace: number;
	private	slots: Array<THREE.Vector3>;
	private	cards: Array<Card>;
	private	selectedCards: CardHand;
	private selectedBoundSpace: number;
	private selectedSlots: Array<THREE.Vector3>;
	private playerId: string;
	
	constructor(playerId: string,
				position: THREE.Vector3 = new THREE.Vector3(0, 0, 0),
				rotation: THREE.Euler = new THREE.Euler(0, 0, 0), 
				boundSpace: number = 10, 
				selectedBoundSpace: number = 5) {
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
		this.updateCardObjects(this.cards, this.slots);
	}

	public removeCard(card: Card) {
		let index = this.cards.indexOf(card);
		if (index == -1) {
			console.log('Card to remove not found');
			return ;
		}
		this.cards.splice(index, 1);
		this.slots = this.calculateSlots(this.cards, this.boundSpace);
		this.updateCardObjects(this.cards, this.slots);
	}

	public removeCardByIndex(index: number): Card | undefined {
		console.log(this.cards);
		const card = this.cards.at(index);
		if (card === undefined) {
			console.log('Card to remove not found');
			return (undefined);
		}
		this.cards.splice(index, 1);
		this.slots = this.calculateSlots(this.cards, this.boundSpace);
		this.updateCardObjects(this.cards, this.slots);
		return (card);
	}

	public sortCards(compareFunction: (a: Card, b: Card) => number) {
		this.cards.sort(compareFunction);
		this.updateCardObjects(this.cards, this.slots);
	}

	public updateManager(position: THREE.Vector3 | undefined, rotation: THREE.Euler | undefined) {
		if (position !== undefined) {
			this.position = position;
		}
		if (rotation !== undefined) {
			this.rotation = rotation;
		}
		this.slots = this.calculateSlots(this.cards, this.boundSpace);
		this.updateCardObjects(this.cards, this.slots);
		this.selectedSlots = this.calculateSlots(this.selectedCards.cards, this.selectedBoundSpace);
		this.updateCardObjects(this.selectedCards.cards, this.selectedSlots);
	}

	// very prone to breaking lol, gotta revamp
	private	calculateSlots(cards: Array<Card>, boundSpace: number, offset?: THREE.Vector3): Array<THREE.Vector3> {
		if (offset === undefined)
			offset = new THREE.Vector3(0, 0, 0);
		const slots: Array<THREE.Vector3> = [];
		const leftBound = -(boundSpace / 2)
		const rightBound = boundSpace / 2
		for (let i = 0; i < cards.length; i++) {
			let normalizedIndex = cards.length > 1 ? i / (cards.length - 1) : 0.5;
			let x = THREE.MathUtils.lerp(leftBound, rightBound, normalizedIndex);
			const slot = new THREE.Vector3(this.position.x + offset.x + x, this.position.y + offset.y, this.position.z + offset.z);
			slots.push(this.rotateAroundPivot(slot, this.position, this.rotation));
		}
		return (slots)
	}

	private rotateAroundPivot(position: THREE.Vector3, pivot: THREE.Vector3, rotation: THREE.Euler) {
		return (new THREE.Vector3().copy(position).sub(pivot).applyEuler(rotation).add(pivot));
	}

	private updateCardObjects(cards: Array<Card>, slots: Array<THREE.Vector3>) {
		for (let i = 0; i < cards.length; i++) {
			let card = cards.at(i);
			let slot = slots.at(i);
			if (card && slot) {
				let normalizedIndex = cards.length > 1 ? i / (cards.length - 1) : 0.5;
				card.object.position.copy(slot);
				card.object.rotation.copy(this.rotation);
				this.applyFanEffect(card.object, 40, 1, normalizedIndex);
				// console.log(`updated card object rank: ${card.rank} suite: ${card.suite} position: ${card.object.position.x},${card.object.position.y},${card.object.position.z} index: ${normalizedIndex}`);
			}
		}
	}

	private applyFanEffect(object: THREE.Object3D, rotation: number, position: number, normalizedIndex: number) {
		const fanRotationStart = (rotation / 2) * (Math.PI / 180);
		const fanRotationEnd = -(rotation / 2) * (Math.PI / 180);

		const fanPositionValley = -(position / 2)
		const fanPositionPeak = position / 2

		object.rotateZ(THREE.MathUtils.lerp(fanRotationStart, fanRotationEnd, normalizedIndex));
		object.translateY(THREE.MathUtils.lerp(fanPositionValley, fanPositionPeak, Math.sin(normalizedIndex * Math.PI)));
		object.translateZ(THREE.MathUtils.lerp(0, 0.1, normalizedIndex));
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
			this.selectedSlots = this.calculateSlots(this.selectedCards.cards, this.selectedBoundSpace, new THREE.Vector3(0, 3, 0));
			this.updateCardObjects(this.selectedCards.cards, this.selectedSlots);
		}
	}

	private deselectCard(card: Card) {
		if (this.selectedCards.removeCard(card)) {
			this.receiveCard(card);
			console.log(`Card deselected: ${card.rank}, ${card.suite}`);
			this.selectedSlots = this.calculateSlots(this.selectedCards.cards, this.selectedBoundSpace, new THREE.Vector3(0, 3, 0));
			this.updateCardObjects(this.selectedCards.cards, this.selectedSlots);
		}
	}

	public reset() {
		for (let i = 0; i < this.cards.length; i++) {
			this.cards[i].dispose();
		}
		this.selectedCards.disposeCards();
		this.cards.length = 0;
		this.slots = this.calculateSlots(this.cards, this.boundSpace);
		this.selectedSlots = this.calculateSlots(this.selectedCards.cards, this.selectedBoundSpace);
		this.updateCardObjects(this.cards, this.slots);
		this.updateCardObjects(this.selectedCards.cards, this.selectedSlots);
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