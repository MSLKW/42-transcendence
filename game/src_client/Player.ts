import { io, Socket } from 'socket.io-client';
import * as THREE from 'three';
import { CardTransmit, GameEndStatsTransmit, GameStateTransmit, PlayerTurnTransmit, StatusTransmit, SkipTurnTransmit } from '../src_shared/Types.ts';
import { CardHand } from './CardHand.ts';
import { Card } from './Card.ts';
import { CardManager } from './CardManager.ts';
import { CardHeap } from './CardHeap.ts';
import { scene, renderer, camera, gameStatus, orbitControls } from './main.ts';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

export class Player {
	private	socket: Socket;
	private playerId: string;
	public	cardManager: CardManager;
	private cardHeapRef: CardHeap;
	private raycaster: THREE.Raycaster;
	private startClick: THREE.Vector2;
	private isDragging: boolean;

	private sendCardsButton: HTMLButtonElement;
	private skipTurnButton: HTMLButtonElement;
	private sortCardsByRankButton: HTMLButtonElement;
	private sortCardsBySuitButton: HTMLButtonElement


	constructor(socket: Socket, playerId: string, cardHeapRef: CardHeap) {
		this.socket = socket;
		this.cardHeapRef = cardHeapRef;
		this.playerId = playerId;
		this.raycaster = new THREE.Raycaster();
		this.startClick = new THREE.Vector2();
		this.isDragging = false;

		this.sendCardsButton = document.getElementById('send-cards-button') as HTMLButtonElement;
		this.skipTurnButton = document.getElementById('skip-turn-button') as HTMLButtonElement;
		this.sortCardsByRankButton = document.getElementById('sort-cards-by-rank-button') as HTMLButtonElement;
		this.sortCardsBySuitButton = document.getElementById('sort-cards-by-suit-button') as HTMLButtonElement;

		this.cardManager = new CardManager(this.playerId);

		if (this.sendCardsButton === undefined || 
			this.skipTurnButton === undefined || 
			this.sortCardsByRankButton === undefined ||
			this.sortCardsBySuitButton === undefined) {
			console.error("Player could not get HTML buttons");
			return ;
		}
		this.setupListeners();
		this.setPlayerTurnUI(false);
	}

	public getPlayerId() {
		return (this.playerId);
	}

	public setupGameState(gameState: GameStateTransmit) {
		this.collectCards(gameState.playerCards);
		this.setPlayerTurnUI(gameState.isPlayerTurn);
	}

	private setupListeners() {
		this.socket.on("game_end", (gameEndStats: GameEndStatsTransmit) => {
			this.cardManager.reset();
			this.cardHeapRef.reset();
			gameStatus.setGameStats(gameEndStats, this);
			gameStatus.setLightboxActive(true);
			console.log(gameEndStats);
		})
		
		this.socket.on("player_play_card_hand_request", (status: StatusTransmit) => {
			if (status.success === true) {
				const cardHand = this.cardManager.sendSelectedCards();
				this.cardHeapRef.receiveCardHand(cardHand);
			} else {
				console.log(`player_play_card_hand_request error: ${status.message}`);
			}
		});
		
		this.socket.on("player_turn", (playerTurn: PlayerTurnTransmit) => {
			if (this.playerId === playerTurn.playerId) {
				this.setPlayerTurnUI(true, playerTurn.skippable);
			}
			else {
				this.setPlayerTurnUI(false);
			}
			console.log(`It is now Player<${playerTurn.playerId}>'s turn! Timer is set at ${playerTurn.timer} seconds!`);
		});

		this.socket.on("player_skip_turn_request", (status: StatusTransmit) => {
			if (status.success === false) {
				console.log(`player_skip_turn_request message: ${status.message}`);
			}
		})

		this.socket.on("player_skip_turn", (skipTurn: SkipTurnTransmit) => {
			console.log(`Player<${skipTurn.playerId}> skipped their turn!`);
		});

		this.sendCardsButton.addEventListener('click', () => {
			const cardHandTransmit = this.cardManager.selectedCards.transmit();
			this.socket.emit("player_play_card_hand_request", cardHandTransmit);
		});
		
		this.skipTurnButton.addEventListener('click', () => {
			this.socket.emit("player_skip_turn_request");
		});

		this.sortCardsByRankButton.addEventListener('click', () => {
			this.cardManager.setSort((a, b) => a.rank - b.rank);
		});

		this.sortCardsBySuitButton.addEventListener('click', () => {
			this.cardManager.setSort((a, b) => a.suit - b.suit);
		});

		renderer.domElement.addEventListener('pointerdown', (event) => {
			orbitControls.enabled = false;
			this.startClick.x = event.clientX;
			this.startClick.y = event.clientY;
			this.isDragging = false;
			this.eventDrag(event);
		})

		renderer.domElement.addEventListener('pointermove', (event) => {
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

		renderer.domElement.addEventListener('pointerup', (event) => {
			console.log(`isDragging: ${this.isDragging}`);
			if (this.cardManager.draggedCard !== undefined) {
				this.eventDropDrag(event);
			}
			if (this.isDragging === false) {
				this.eventClick(event);
			}
			this.isDragging = false;
			orbitControls.enabled = true;
		})
	}

	private raycast(event: PointerEvent) {
		const canvas = renderer.domElement.getBoundingClientRect();
		const mouse = new THREE.Vector2(
			((event.clientX - canvas.left) / canvas.width) * 2 - 1,
			-((event.clientY - canvas.top) / canvas.height) * 2 + 1
		);
		this.raycaster.setFromCamera(mouse, camera);
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

	private setPlayerTurnUI(isTurn: boolean, skippable: boolean = true) {
		if (isTurn === true) {
			this.sendCardsButton.disabled = false;
			this.skipTurnButton.disabled = !skippable;
		}
		else {
			this.sendCardsButton.disabled = true;
			this.skipTurnButton.disabled = true;
		}
	}

	private collectCards(cardTransmits: Array<CardTransmit>) {
		for (let i = 0; i < cardTransmits.length; i++) {
			let card = new Card(cardTransmits[i].rank, cardTransmits[i].suit);
			this.cardManager.receiveCard(card);
		}
	}
}