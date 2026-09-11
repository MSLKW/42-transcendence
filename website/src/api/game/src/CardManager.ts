import * as THREE from 'three';
import { Card } from './Card.ts';
import { CardHand } from './CardHand.ts';
import { gsap } from 'gsap';
import { threejsManager } from '../../../App.tsx';
import { gameScene } from '../../../components/3d/ThreeJsManager.ts';

export class CardManager {
	/* Card Manager */
	private position: THREE.Vector3;
	private rotation: THREE.Quaternion;
	public	isLocked: boolean;

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
	private	selectedOffset: THREE.Vector3;

	/* References */
	private playerId: string;
	private sortFunction: ((a: Card, b: Card) => number) | undefined;

	/* Dragging */
	public	draggedCard: Card | undefined;
	private dragPlane: THREE.Plane;
	private dropThresholdY: number = 2;

	/* Fanning Effect */
	private fanRotation: number = 30;
	private fanHeight: number = 1;
	
	constructor(playerId: string,
				position: THREE.Vector3 = new THREE.Vector3(0, 0, 0),
				rotation: THREE.Quaternion = new THREE.Quaternion(0, 0, 0),
				boundSpace: number = 5, 
				selectedBoundSpace: number = 3) {
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
		this.selectedOffset = new THREE.Vector3(0, 3, 0);
		this.dragPlane = new THREE.Plane().setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 0, 1), this.position);
		this.sortFunction = undefined;
		this.draggedCard = undefined;
		this.isLocked = true;
	}

	public receiveCard(card: Card, index: number = this.cards.length, duration: number = 0.1): gsap.core.Timeline {
		this.cards.splice(index, 0, card);
		card.isHover = false;
		this.slots = this.calculateSlots(this.cards, this.boundSpaceLimit);
		this.sortCards();
		this.initHitBoxes(this.cards, this.slots);
		return (this.updateCardObjects(this.cards, this.slots, duration));
	}

	public removeCard(card: Card): gsap.core.Timeline | undefined {
		let index = this.cards.indexOf(card);
		if (index == -1) {
			return (undefined);
		}
		this.cards.splice(index, 1);
		this.slots = this.calculateSlots(this.cards, this.boundSpaceLimit);
		this.sortCards();
		this.initHitBoxes(this.cards, this.slots);
		return (this.updateCardObjects(this.cards, this.slots));
	}

	public removeCardByIndex(index: number): [Card | undefined, gsap.core.Timeline | undefined] {
		const card = this.cards.at(index);
		if (card === undefined) {
			console.log('Card to remove not found');
			return ([undefined, undefined]);
		}
		return ([card, this.removeCard(card)]);
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

	public getCardsAmount(): number {
		return (this.cards.length);
	}

	public updateManager(position: THREE.Vector3 | undefined, rotation: THREE.Quaternion | undefined): gsap.core.Timeline {
		const timeline = gsap.timeline();
		if (position !== undefined) {
			this.position = position;
		}
		if (rotation !== undefined) {
			this.rotation = rotation;
		}
		this.dragPlane.setFromNormalAndCoplanarPoint(this.dragPlane.normal.clone().applyQuaternion(this.rotation), this.position);
		this.dragPlane.constant -= 0.2;
		this.slots = this.calculateSlots(this.cards, this.boundSpaceLimit);
		this.initHitBoxes(this.cards, this.slots);
		timeline.add(this.updateCardObjects(this.cards, this.slots), 0);
		this.selectedSlots = this.calculateSlots(this.selectedCards.cards, this.selectedBoundSpaceLimit, this.selectedOffset);
		timeline.add(this.updateCardObjects(this.selectedCards.cards, this.selectedSlots), 0);
		return (timeline);
	}

	// Revamp so that it is bundled up together instead of separated when on low cards
	private	calculateSlots(cards: Array<Card>, boundSpaceLimit: number, offset?: THREE.Vector3): Array<THREE.Vector3> {
		if (offset === undefined)
			offset = new THREE.Vector3(0, 0, 0);
		const slots: Array<THREE.Vector3> = [];
		const boundSpace = Math.min(boundSpaceLimit, (cards.length - 1) * Card.Width / 2);
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
			width = Math.min(width, slots[0].distanceTo(slots[1]));
		}
		const hitboxes: Array<THREE.Mesh> = [];
		for (let i = 0; i < slots.length; i++) {
			const hitboxGeometry = new THREE.PlaneGeometry(width, Card.Height);
			const hitboxMesh = new THREE.Mesh(hitboxGeometry, CardManager.invisibleMaterial);
			hitboxMesh.userData.card = cards[i];
			hitboxMesh.position.copy(slots[i]);
			hitboxMesh.quaternion.copy(this.rotation);
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
			gameScene.scene.remove(mesh);
		}
		if (hitboxes.length > 0)
			gameScene.scene.add(...hitboxes);
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

	private updateCardObjects(cards: Array<Card>, slots: Array<THREE.Vector3>, duration: number = 0.1): gsap.core.Timeline {
		const timeline = gsap.timeline();
		for (let i = 0; i < cards.length; i++) {
			let card = cards.at(i);
			let slot = slots.at(i);
			if (card && slot) {
				let normalizedIndex = cards.length > 1 ? i / (cards.length - 1) : 0.5;
				let updatedPosition = slot.clone();
				let updatedRotation = this.rotation.clone();
				this.applyFanRotationEffect(updatedRotation, normalizedIndex);
				this.applyHoverEffect(card, updatedPosition);
				if (updatedPosition !== card.object.position || updatedRotation !== card.object.quaternion) {
					timeline.add(card.move(updatedPosition, updatedRotation, duration), 0);
				}
				// console.log(`updated card object rank: ${card.rank} suit: ${card.suit} position: ${card.object.position.x},${card.object.position.y},${card.object.position.z} index: ${normalizedIndex}`);
			}
		}
		return (timeline);
	}

	// Will mutate rotation
	private applyFanRotationEffect(rotation: THREE.Quaternion, normalizedIndex: number) {
		const fanRotationStart = (this.fanRotation / 2) * (Math.PI / 180);
		const fanRotationEnd = -(this.fanRotation / 2) * (Math.PI / 180);

		rotation.multiply(
			new THREE.Quaternion().setFromAxisAngle(
				new THREE.Vector3(0, 0, 1), 
				THREE.MathUtils.lerp(fanRotationStart, fanRotationEnd, normalizedIndex)
			)
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
		const index = threejsManager.outlinePass.selectedObjects.indexOf(card.object);
		if (card.isHover === true) {
			if (index === -1) {
				threejsManager.outlinePass.selectedObjects.push(card.object);
			}
			position.add(new THREE.Vector3(0, 0.5, 0.1).applyQuaternion(card.object.quaternion));
		}
		else if (card.isHover === false && index !== -1) {
			threejsManager.outlinePass.selectedObjects.splice(index, 1);
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
		if (this.isLocked === true) {
			return ;
		}
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
		const selected = this.selectedCards.receiveCard(card);
		if (selected) {
			this.removeCard(card);
			card.isHover = false;
			this.selectedSlots = this.calculateSlots(this.selectedCards.cards, this.selectedBoundSpaceLimit, this.selectedOffset);
			this.updateCardObjects(this.selectedCards.cards, this.selectedSlots);
		}
		return (selected);
	}

	private deselectCard(card: Card, receiveCard: boolean = true) {
		if (this.selectedCards.removeCard(card)) {
			if (receiveCard === true) {
				this.receiveCard(card);
			}
			card.isHover = false;
			this.selectedSlots = this.calculateSlots(this.selectedCards.cards, this.selectedBoundSpaceLimit, this.selectedOffset);
			this.updateCardObjects(this.selectedCards.cards, this.selectedSlots);
		}
	}

	public pickupDraggedCard(raycaster: THREE.Raycaster) {
		if (this.draggedCard !== undefined || this.isLocked === true)
			return ;
		let cardObjects = Card.getCardObjects(this.cards);
		let cardHandObjects = Card.getCardObjects(this.selectedCards.cards);
		let intersected = raycaster.intersectObjects(cardObjects.concat(cardHandObjects));
		if (intersected.length > 0) {
			let card: Card = intersected[0].object.userData.instance;
			this.draggedCard = card;
			if (this.cards.indexOf(card) >= 0) {
				this.removeCard(card);
			}
			else if (this.selectedCards.cards.indexOf(card) >= 0) {
				this.deselectCard(card, false);
			}
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
		if (this.localizePosition(this.draggedCard.object.position).y > this.dropThresholdY && this.selectCard(this.draggedCard) === true) {
			this.draggedCard = undefined;
		}
		else {
			this.receiveCard(this.draggedCard, this.getInsertIndex(this.draggedCard));
			this.draggedCard = undefined;
		}
	}

	private getInsertIndex(draggedCard: Card): number {
		const draggedCardWorldPos = new THREE.Vector3();
		draggedCard.object.getWorldPosition(draggedCardWorldPos);
		let closestSlotIndex = 0;
		let closestDistance = Infinity;
		for (let i = 0; i < this.slots.length; i++) {
			const distanceSquared = this.slots[i].distanceToSquared(draggedCardWorldPos);
			if (distanceSquared < closestDistance) {
				closestDistance = distanceSquared;
				closestSlotIndex = i;
			}
		}
		const closestSlot = this.slots[closestSlotIndex];
		let insertIndex = this.cards.length;
		if (closestSlot !== undefined) {
			const checkLeftRight = closestSlot.clone().cross(draggedCardWorldPos);
			if (checkLeftRight.z > 0) {
				insertIndex = Math.max(closestSlotIndex, 0); // Left
			}
			else if (checkLeftRight.z < 0) {
				insertIndex = closestSlotIndex + 1; // Right
			}
		}
		return (insertIndex);
	}

	public hoverCard(raycaster: THREE.Raycaster) {
		if (this.isLocked === true) {
			return ;
		}
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

	private  localizePosition(position: THREE.Vector3) {
		const invQuat = this.rotation.clone().invert();
		return (position.clone().sub(this.position).applyQuaternion(invQuat));
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