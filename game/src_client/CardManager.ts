import * as THREE from 'three';
import { Card } from './Card.ts';
import { CardHand } from './CardHand.ts';
import { outlinePass, scene } from './main.ts';
import { outline } from 'three/examples/jsm/tsl/display/OutlineNode.js';
import { CardHandTransmit } from '../src_shared/Types.ts';
import { update } from 'three/examples/jsm/libs/tween.module.js';

export class CardManager {
	/* Card Manager */
	private position: THREE.Vector3;
	private rotation: THREE.Quaternion;

	/* Main Cards */
	private boundSpaceLimit: number;
	private	slots: Array<THREE.Vector3>;
	private	cards: Array<Card>;

	/* Hitboxes */
	private hitboxes: Array<THREE.Mesh>;
	private static invisibleMaterial = new THREE.MeshBasicMaterial({
		colorWrite: false,
		depthWrite: false
	});

	/* Selected Cards */
	public	selectedCards: CardHand;
	private selectedBoundSpaceLimit: number;
	private selectedSlots: Array<THREE.Vector3>;

	/* References */
	private playerId: string;
	private sortFunction: ((a: Card, b: Card) => number) | undefined;

	/* Dragging */
	public	draggedCard: Card | undefined;
	private dragPlane: THREE.Plane;

	/* Fanning Effect */
	private fanRotation: number = 20;
	private fanHeight: number = 1;
	
	constructor(playerId: string,
				position: THREE.Vector3 = new THREE.Vector3(0, 0, 0),
				rotation: THREE.Quaternion = new THREE.Quaternion(0, 0, 0),
				boundSpace: number = 10, 
				selectedBoundSpace: number = 5) {
		this.position = position;
		this.rotation = rotation;
		this.slots = [];
		this.cards = [];
		this.hitboxes = [];
		this.playerId = playerId
		this.selectedCards = new CardHand(this.playerId);
		this.boundSpaceLimit = boundSpace;
		this.selectedBoundSpaceLimit = selectedBoundSpace;
		this.selectedSlots = [];
		this.dragPlane = new THREE.Plane().setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 0, 1), this.position);
		this.sortFunction = undefined;
		this.draggedCard = undefined;
	}

	public receiveCard(card: Card) {
		this.cards.push(card);
		this.slots = this.calculateSlots(this.cards, this.boundSpaceLimit);
		this.sortCards();
		this.initHitBoxes(this.cards, this.slots);
		this.updateCardObjects(this.cards, this.slots);
	}

	public removeCard(card: Card) {
		let index = this.cards.indexOf(card);
		if (index == -1) {
			return ;
		}
		this.cards.splice(index, 1);
		this.slots = this.calculateSlots(this.cards, this.boundSpaceLimit);
		this.sortCards();
		this.initHitBoxes(this.cards, this.slots);
		this.updateCardObjects(this.cards, this.slots);
	}

	public removeCardByIndex(index: number): Card | undefined {
		const card = this.cards.at(index);
		if (card === undefined) {
			console.log('Card to remove not found');
			return (undefined);
		}
		this.removeCard(card);
		return (card);
	}

	public setSort(sortFunction: ((a: Card, b: Card) => number) | undefined) {
		this.sortFunction = sortFunction;
		this.sortCards();
	}

	private sortCards() {
		if (this.sortFunction !== undefined) {
			this.cards.sort(this.sortFunction);
			this.initHitBoxes(this.cards, this.slots);
			this.updateCardObjects(this.cards, this.slots);
		}
	}

	public updateManager(position: THREE.Vector3 | undefined, rotation: THREE.Quaternion | undefined) {
		if (position !== undefined) {
			this.position = position;
		}
		if (rotation !== undefined) {
			this.rotation = rotation;
		}
		this.dragPlane.setFromNormalAndCoplanarPoint(this.dragPlane.normal.clone().applyQuaternion(this.rotation), this.position);
		this.slots = this.calculateSlots(this.cards, this.boundSpaceLimit);
		this.updateCardObjects(this.cards, this.slots);
		this.selectedSlots = this.calculateSlots(this.selectedCards.cards, this.selectedBoundSpaceLimit);
		this.updateCardObjects(this.selectedCards.cards, this.selectedSlots);
	}

	// Revamp so that it is bundled up together instead of separated when on low cards
	private	calculateSlots(cards: Array<Card>, boundSpaceLimit: number, offset?: THREE.Vector3): Array<THREE.Vector3> {
		if (offset === undefined)
			offset = new THREE.Vector3(0, 0, 0);
		const slots: Array<THREE.Vector3> = [];
		const boundSpace = Math.min(boundSpaceLimit, (cards.length - 1) * Card.Width);
		this.fanHeight = boundSpace / 2 * Math.tan((this.fanRotation * Math.PI / 180) / 4);
		const leftBound = -(boundSpace / 2);
		const rightBound = boundSpace / 2;
		for (let i = 0; i < cards.length; i++) {
			let normalizedIndex = cards.length > 1 ? i / (cards.length - 1) : 0.5;
			let x = THREE.MathUtils.lerp(leftBound, rightBound, normalizedIndex);
			const slot = new THREE.Vector3(this.position.x + offset.x + x, this.position.y + offset.y, this.position.z + offset.z);
			this.rotateAroundPivot(slot, this.position, this.rotation);
			this.applyFanPositionEffect(slot, this.rotation, normalizedIndex);
			slots.push(slot);
		}
		return (slots)
	}

	// Mutate position
	private rotateAroundPivot(position: THREE.Vector3, pivot: THREE.Vector3, rotation: THREE.Quaternion) {
		position.sub(pivot).applyQuaternion(rotation).add(pivot);
	}

	private initHitBoxes(cards: Array<Card>, slots: Array<THREE.Vector3>) {
		if (slots.length !== cards.length) {
			console.log(`initHitBoxes: slots and cards do not match`);
			return ;
		}
		let width = Card.Width;
		if (slots[0] !== undefined && slots[1] !== undefined) {
			width = Math.min(width, Math.abs(slots[1].x - slots[0].x));
		}
		const hitboxes: Array<THREE.Mesh> = [];
		for (let i = 0; i < slots.length; i++) {
			const hitboxGeometry = new THREE.PlaneGeometry(width, Card.Height);
			const hitboxMesh = new THREE.Mesh(hitboxGeometry, CardManager.invisibleMaterial);
			hitboxMesh.userData.card = cards[i];
			hitboxMesh.position.copy(slots[i]);
			let normalizedIndex = cards.length > 1 ? i / (cards.length - 1) : 0.5;
			this.applyFanRotationEffect(hitboxMesh.quaternion, normalizedIndex);
			hitboxes.push(hitboxMesh);
		}
		if (width < Card.Width) {
			this.manipulateHitBoxes(hitboxes);
		}
		for (let i = 0; i < this.hitboxes.length; i++) {
			const mesh = this.hitboxes[i];
			mesh.geometry.dispose();
			scene.remove(mesh);
		}
		if (hitboxes.length > 0)
			scene.add(...hitboxes);
		this.hitboxes = hitboxes;
	}

	private manipulateHitBoxes(hitboxes: Array<THREE.Mesh>) {
		const extension = 0.5;
		for (let i = 0; i < hitboxes.length; i++) {
			const vertices = hitboxes[i].geometry.attributes.position;
			if (i === 0) {
				vertices.setX(0, -extension);
				vertices.setX(2, -extension);
			}
			else if (i === hitboxes.length - 1) {
				vertices.setX(1, extension);
				vertices.setX(3, extension);
			}
			const nextHitbox = hitboxes[i + 1];
			if (nextHitbox !== undefined) {
				const secondVertices = nextHitbox.geometry.attributes.position;
				hitboxes[i].updateMatrixWorld(true);
				nextHitbox.updateMatrixWorld(true);
				this.stitchVertices(hitboxes[i], nextHitbox, 1, 0);
				this.stitchVertices(hitboxes[i], nextHitbox, 3, 2);
				secondVertices.needsUpdate = true;
			}
			vertices.needsUpdate = true;
		}
	}
	
	private stitchVertices(leftMesh: THREE.Mesh, rightMesh: THREE.Mesh, leftVerticeIndex: number, rightVerticeIndex: number) {
		const leftBuffer = leftMesh.geometry.attributes.position;
		const rightBuffer = rightMesh.geometry.attributes.position;

		const leftWorld = new THREE.Vector3().fromBufferAttribute(leftBuffer, leftVerticeIndex).applyMatrix4(leftMesh.matrixWorld);
		const rightWorld = new THREE.Vector3().fromBufferAttribute(rightBuffer, rightVerticeIndex).applyMatrix4(rightMesh.matrixWorld);

		const midWorld = new THREE.Vector3().lerpVectors(leftWorld, rightWorld, 0.5);

		const leftLocal = midWorld.clone().applyMatrix4(leftMesh.matrixWorld.clone().invert());
		const rightLocal = midWorld.clone().applyMatrix4(rightMesh.matrixWorld.clone().invert());

		leftBuffer.setXYZ(leftVerticeIndex, leftLocal.x, leftLocal.y, leftLocal.z);
		rightBuffer.setXYZ(rightVerticeIndex, rightLocal.x, rightLocal.y, rightLocal.z);
	}

	private updateCardObjects(cards: Array<Card>, slots: Array<THREE.Vector3>) {
		for (let i = 0; i < cards.length; i++) {
			let card = cards.at(i);
			let slot = slots.at(i);
			if (card && slot) {
				let normalizedIndex = cards.length > 1 ? i / (cards.length - 1) : 0.5;
				let updatedPosition = new THREE.Vector3().copy(slot);
				let updatedRotation = new THREE.Quaternion().copy(this.rotation);
				this.applyFanRotationEffect(updatedRotation, normalizedIndex);
				this.applyHoverEffect(card, updatedPosition);
				if (updatedPosition !== card.object.position || updatedRotation !== card.object.quaternion) {
					card.move(updatedPosition, new THREE.Euler().setFromQuaternion(updatedRotation));
				}
				// console.log(`updated card object rank: ${card.rank} suit: ${card.suit} position: ${card.object.position.x},${card.object.position.y},${card.object.position.z} index: ${normalizedIndex}`);
			}
		}
	}

	// Will mutate rotation
	private applyFanRotationEffect(rotation: THREE.Quaternion, normalizedIndex: number) {
		const fanRotationStart = (this.fanRotation / 2) * (Math.PI / 180);
		const fanRotationEnd = -(this.fanRotation / 2) * (Math.PI / 180);

		rotation.multiply(
			new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 
			THREE.MathUtils.lerp(fanRotationStart, fanRotationEnd, normalizedIndex))
		);
	}

	// Will mutate position
	private applyFanPositionEffect(position: THREE.Vector3, rotation: THREE.Quaternion, normalizedIndex: number) {
		const fanRotationStart = (this.fanRotation / 2) * (Math.PI / 180);
		const fanRotationEnd = -(this.fanRotation / 2) * (Math.PI / 180);

		const fanPositionValley = -(this.fanHeight / 2);
		const fanPositionPeak = this.fanHeight / 2;

		const newRotation = new THREE.Quaternion().multiplyQuaternions(
			rotation, 
			new THREE.Quaternion().setFromAxisAngle(
				new THREE.Vector3(0, 0, 1), 
				THREE.MathUtils.lerp(fanRotationStart, fanRotationEnd, normalizedIndex))
		);
		position.add(new THREE.Vector3(
				0, 
				THREE.MathUtils.lerp(fanPositionValley, fanPositionPeak, Math.sin(normalizedIndex * Math.PI)), 
				THREE.MathUtils.lerp(0, 0.1, normalizedIndex)
			).applyQuaternion(newRotation)
		);
	}

	// Will mutate position
	private applyHoverEffect(card: Card, position: THREE.Vector3) {
		const index = outlinePass.selectedObjects.indexOf(card.object);
		if (card.isHover === true) {
			if (index === -1) {
				outlinePass.selectedObjects.push(card.object);
			}
			position.add(new THREE.Vector3(0, 0.5, 0.1).applyQuaternion(card.object.quaternion));
		}
		else if (card.isHover === false && index !== -1) {
			outlinePass.selectedObjects.splice(index, 1);
		}
	}

	// private applyCurveEffect(object: THREE.Object3D, rotation: number, position: number, normalizedIndex: number) {
	// 	const curveRotationStart = (rotation / 2) * (Math.PI / 180);
	// 	const curveRotationEnd = -(rotation / 2) * (Math.PI / 180);

	// 	const curvePositionStart = -(position / 2);
	// 	const curvePositionEnd = position / 2;

	// 	object.rotateY(THREE.MathUtils.lerp(curveRotationStart, curveRotationEnd, normalizedIndex));
	// 	object.translateZ(
	// 		THREE.MathUtils.lerp(curvePositionEnd, curvePositionStart, Math.sin(normalizedIndex * Math.PI)) +
	// 		THREE.MathUtils.lerp(curvePositionStart * 4, curvePositionEnd * 4, normalizedIndex)
	// 	);
	// }

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
			this.removeCard(card);
			card.isHover = false;
			this.selectedSlots = this.calculateSlots(this.selectedCards.cards, this.selectedBoundSpaceLimit, new THREE.Vector3(0, 3, 0));
			this.updateCardObjects(this.selectedCards.cards, this.selectedSlots);
		}
	}

	private deselectCard(card: Card) {
		if (this.selectedCards.removeCard(card)) {
			this.receiveCard(card);
			card.isHover = false;
			this.selectedSlots = this.calculateSlots(this.selectedCards.cards, this.selectedBoundSpaceLimit, new THREE.Vector3(0, 3, 0));
			this.updateCardObjects(this.selectedCards.cards, this.selectedSlots);
		}
	}

	public pickupDraggedCard(raycaster: THREE.Raycaster) {
		if (this.draggedCard !== undefined) 
			return ;
		let cardObjects = Card.getCardObjects(this.cards);
		let intersected = raycaster.intersectObjects(cardObjects);
		if (intersected.length > 0) {
			let card: Card = intersected[0].object.userData.instance;
			this.draggedCard = card;
			this.removeCard(card);
		}
	}

	public moveDraggedCard(raycaster: THREE.Raycaster) {
		if (this.draggedCard === undefined)
			return ;
		const intersectedPoint = new THREE.Vector3();
		raycaster.ray.intersectPlane(this.dragPlane, intersectedPoint);
		this.draggedCard.object.position.copy(intersectedPoint);
		this.draggedCard.object.quaternion.copy(this.rotation);
	}

	public dropDraggedCard(raycaster: THREE.Raycaster) {
		if (this.draggedCard === undefined)
			return ;
		this.receiveCard(this.draggedCard);
		this.draggedCard = undefined;
	}

	public hoverCard(raycaster: THREE.Raycaster) {
		for (let i = 0; i < this.cards.length; i++) {
			this.cards[i].isHover = false;
		}
		let intersected = raycaster.intersectObjects(this.hitboxes);
		if (intersected.length > 0) {
			let card: Card = intersected[0].object.userData.card;
			card.isHover = true;
		}
		this.updateCardObjects(this.cards, this.slots);
	}

	public reset() {
		for (let i = 0; i < this.cards.length; i++) {
			this.cards[i].dispose();
		}
		this.selectedCards.disposeCards();
		this.cards.length = 0;
		this.slots = this.calculateSlots(this.cards, this.boundSpaceLimit);
		this.selectedSlots = this.calculateSlots(this.selectedCards.cards, this.selectedBoundSpaceLimit);
		this.updateCardObjects(this.cards, this.slots);
		this.updateCardObjects(this.selectedCards.cards, this.selectedSlots);
	}

	public sendSelectedCards(): CardHand {
		const cardHand = this.selectedCards;
		this.selectedCards = new CardHand(this.playerId);
		return (cardHand);
	}
}