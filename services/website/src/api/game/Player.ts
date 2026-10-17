import { Socket } from 'socket.io-client';
import * as THREE from 'three';
import { type CardTransmit, type GameStateTransmit, type PlayerTurnTransmit, type StatusTransmit, type SkipTurnTransmit } from '@big2/game-types';
import { Card } from './Card';
import { CardHeap } from './CardHeap';
import { threejsManager } from '../../App';
import { Participant } from './Participant';
import { useGameStore } from '../../store/GameStore';

export class Player extends Participant {
	private raycaster: THREE.Raycaster;
	private startClick: THREE.Vector2;
	private isDragging: boolean;

	constructor(socket: Socket, playerId: string, cardHeapRef: CardHeap) {
		super(socket, playerId, cardHeapRef);
		this.raycaster = new THREE.Raycaster();
		this.startClick = new THREE.Vector2();
		this.isDragging = false;

		this.bindListeners();
	}

	public getPlayerId() {
		return (this.uuid);
	}

	public override sync(gameState: GameStateTransmit) {
		this.collectCards(gameState.playerCards);
	}

	private bindListeners() {
		this.socket.on("player_turn", (playerTurn: PlayerTurnTransmit) => {
			console.log("[gameSocket] 'player_turn': ", playerTurn);
			const newPlayerPassed = [...useGameStore.getState().playerPassed];
			const index = newPlayerPassed.findIndex((skippedUuid) => skippedUuid === playerTurn.playerId);
			if (index !== -1) {
				newPlayerPassed.splice(index, 1);
				useGameStore.setState({ playerPassed: newPlayerPassed });
			}
			const activeSeat = useGameStore.getState().gameSeats.findIndex((uuid) => uuid === playerTurn.playerId);
			useGameStore.setState({
				activeSeat: activeSeat, 
				isActiveSeatSkippable: playerTurn.skippable,
				playerTimer: playerTurn.timer,
			});
		});

		this.socket.on("player_skip_turn_request", (status: StatusTransmit) => {
			if (status.success === false) {
				if (useGameStore.getState().gameVerboseMode)
					console.log(`player_skip_turn_request message: ${status.message}`);
			}
		})

		this.socket.on("player_skip_turn", (skipTurn: SkipTurnTransmit) => {
			console.log("[gameSocket] 'player_skip_turn': ", skipTurn);
			const newPlayerPassed = [...useGameStore.getState().playerPassed];
			if (newPlayerPassed.find((skippedUuid) => skippedUuid === skipTurn.playerId) === undefined) {
				newPlayerPassed.push(skipTurn.playerId);
				useGameStore.setState({ playerPassed: newPlayerPassed });
			}
		});

		threejsManager.renderer.domElement.addEventListener('pointerdown', (event) => {
			this.startClick.x = event.clientX;
			this.startClick.y = event.clientY;
			this.isDragging = false;
			this.eventDrag(event);
		})

		threejsManager.renderer.domElement.addEventListener('pointermove', (event) => {
			const xDelta = Math.abs(event.clientX - this.startClick.x);
			const yDelta = Math.abs(event.clientY - this.startClick.y);

			if (xDelta > 5 || yDelta > 5) {
				this.isDragging = true;
			}
			if (this.cardManager.draggedCard !== undefined) {
				this.eventMoveDrag(event);
			}
			this.eventHover(event);
		})

		threejsManager.renderer.domElement.addEventListener('pointerup', (event) => {
			if (this.cardManager.draggedCard !== undefined) {
				if (this.isDragging === true) {
					this.setSort("Flex");
				}
				this.eventDropDrag(event);
			}
			if (this.isDragging === false) {
				this.eventClick(event);
				this.eventHover(event);
			}
			this.isDragging = false;
		})

		// DEBUG
		window.addEventListener('keydown', (event) => {
			if (event.code === "Minus") {
				const [card] = this.cardManager.removeCardByIndex(0);
				if (card !== undefined) {
					card.dispose();
				}
			}
			else if (event.code === "Equal") {
				this.cardManager.receiveCard(new Card(0, 0));
			}
			else if (event.code === "Backquote") {
				if (useGameStore.getState().gameVerboseMode)
					console.log("enabling or disabling orbit controls");
				threejsManager.orbitControls.enabled = !threejsManager.orbitControls.enabled;
				threejsManager.orbitControls.update();
			}
		})
	}

	public unbindListeners() {
		this.socket.off("player_turn");
		this.socket.off("player_skip_turn");
		// threejsManager.renderer.domElement.removeEventListener('pointerdown');
	}

	public sendCardsButtonHandler() {
		const cardHandTransmit = this.cardManager.selectedCards.transmit();
		this.socket.emit("player_play_card_hand_request", cardHandTransmit, (status: StatusTransmit) => {
			console.log(`[gameSocket] 'player_play_card_hand_request': `, status);
			if (status.success === true) {
				const cardHand = this.cardManager.sendSelectedCards();
				this.cardHeapRef.cardHandQueue.add(this.cardHeapRef.receiveCardHand(cardHand));
				useGameStore.getState().reduceCardsLeft(this.uuid, cardHand.cards.length);
			}
		});
	}

	public skipTurnButtonHandler() {
		this.socket.emit("player_skip_turn_request", (status: StatusTransmit) => {
			console.log("[gameSocket] 'player_skip_turn_request': ", status);
		});
	}

	public setSort(sortType: string) {
		if (sortType === "Rank") {
			this.cardManager.setSort((a, b) => a.rank - b.rank);
		}
		else if (sortType === "Suit") {
			this.cardManager.setSort((a, b) => {
				const suitDiff = a.suit - b.suit;
				return (suitDiff === 0 ? a.rank - b.rank : suitDiff);
			});
		}
		else if (sortType === "Flex") {
			this.cardManager.setSort(undefined);
		}
		useGameStore.setState({ sortType: sortType });
	}

	private raycast(event: PointerEvent) {
		const canvas = threejsManager.renderer.domElement.getBoundingClientRect();
		const mouse = new THREE.Vector2(
			((event.clientX - canvas.left) / canvas.width) * 2 - 1,
			-((event.clientY - canvas.top) / canvas.height) * 2 + 1
		);
		this.raycaster.setFromCamera(mouse, threejsManager.camera);
	}

	private eventClick(event: PointerEvent) {
		this.raycast(event);
		this.cardManager.interactCard(this.raycaster);
	}

	private eventDrag(event: PointerEvent) {
		this.raycast(event);
		this.cardManager.pickupDraggedCard(this.raycaster);
	}
	
	private eventMoveDrag(event: PointerEvent) {
		this.raycast(event);
		this.cardManager.moveDraggedCard(this.raycaster);
	}

	private eventDropDrag(event: PointerEvent) {
		this.raycast(event);
		this.cardManager.dropDraggedCard(this.raycaster);
	}

	private eventHover(event: PointerEvent) {
		this.raycast(event);
		this.cardManager.hoverCard(this.raycaster);
	}

	private collectCards(cardTransmits: Array<CardTransmit>) {
		for (let i = 0; i < cardTransmits.length; i++) {
			const card = new Card(cardTransmits[i].rank, cardTransmits[i].suit);
			this.cardManager.receiveCard(card);
		}
	}

	public reset() {
		this.unbindListeners();
	}
}