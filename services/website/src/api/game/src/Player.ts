import { io, Socket } from 'socket.io-client';
import * as THREE from 'three';
import { CardTransmit, GameEndStatsTransmit, GameStateTransmit, PlayerTurnTransmit, StatusTransmit, SkipTurnTransmit } from '@big2/game-types';
import { CardHand } from './CardHand.ts';
import { Card } from './Card.ts';
import { CardManager } from './CardManager.ts';
import { CardHeap } from './CardHeap.ts';
import { threejsManager } from '../../../App.tsx';
import { Participant } from './Participant.ts';
import { useGameStore } from '../../../store/GameStore.ts';

export class Player extends Participant {
	private raycaster: THREE.Raycaster;
	private startClick: THREE.Vector2;
	private isDragging: boolean;

	constructor(socket: Socket, playerId: string, cardHeapRef: CardHeap) {
		super(socket, playerId, cardHeapRef);
		this.raycaster = new THREE.Raycaster();
		this.startClick = new THREE.Vector2();
		this.isDragging = false;

		this.setupListeners();
	}

	public getPlayerId() {
		return (this.uuid);
	}

	public override sync(gameState: GameStateTransmit) {
		this.collectCards(gameState.playerCards);
	}

	private setupListeners() {
		this.socket.on("player_play_card_hand_request", (status: StatusTransmit) => {
			if (status.success === true) {
				const cardHand = this.cardManager.sendSelectedCards();
				this.cardHeapRef.receiveCardHand(cardHand);
				useGameStore.getState().reduceCardsLeft(this.uuid, cardHand.cards.length);
			} else {
				console.log(`player_play_card_hand_request error: ${status.message}`);
			}
		});
		
		this.socket.on("player_turn", (playerTurn: PlayerTurnTransmit) => {
			const activeSeat = useGameStore.getState().gameSeats.findIndex((uuid) => uuid === playerTurn.playerId);
			useGameStore.setState({
				activeSeat: activeSeat, 
				isActiveSeatSkippable: playerTurn.skippable,
				playerTimer: playerTurn.timer
			});
			console.log(`It is now Player<${playerTurn.playerId}>'s turn! Timer is set at ${playerTurn.timer} milliseconds!`);
		});

		this.socket.on("player_skip_turn_request", (status: StatusTransmit) => {
			if (status.success === false) {
				console.log(`player_skip_turn_request message: ${status.message}`);
			}
		})

		this.socket.on("player_skip_turn", (skipTurn: SkipTurnTransmit) => {
			console.log(`Player<${skipTurn.playerId}> skipped their turn!`);
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
				const [card, animation] = this.cardManager.removeCardByIndex(0);
				if (card !== undefined) {
					card.dispose();
				}
			}
			else if (event.code === "Equal") {
				this.cardManager.receiveCard(new Card(0, 0));
			}
			else if (event.code === "Backquote") {
				console.log("enabling or disabling orbit controls");
				threejsManager.orbitControls.enabled = !threejsManager.orbitControls.enabled;
				threejsManager.orbitControls.update();
			}
		})
	}

	public sendCardsButtonHandler() {
		const cardHandTransmit = this.cardManager.selectedCards.transmit();
		this.socket.emit("player_play_card_hand_request", cardHandTransmit);
	}

	public skipTurnButtonHandler() {
		this.socket.emit("player_skip_turn_request");
	}

	// public sortCardsByRankButtonHandler() {
	// 	this.cardManager.setSort((a, b) => a.rank - b.rank);
	// }

	// public sortCardsBySuitButtonHandler() {
	// 	this.cardManager.setSort((a, b) => {
	// 		const suitDiff = a.suit - b.suit;
	// 		return (suitDiff === 0 ? a.rank - b.rank : suitDiff);
	// 	});
	// }

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
			let card = new Card(cardTransmits[i].rank, cardTransmits[i].suit);
			this.cardManager.receiveCard(card);
		}
	}
}