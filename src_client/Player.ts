import { io, Socket } from 'socket.io-client';
import * as THREE from 'three';
import { CardTransmit, CardHandTransmit } from '../src_shared/Types.ts';
import { CardHand } from './CardHand.ts';
import { Card } from './Card.ts';
import { CardManager } from './CardManager.ts';
import { CardHeap } from './CardHeap.ts';
import { scene, renderer, camera } from './main.ts';

export class Player {
	private	socket: Socket;
	private playerId!: string;
	public	cardManager!: CardManager;
	private cardHeapRef: CardHeap;
	private raycaster: THREE.Raycaster;

	constructor(socket: Socket, playerId: string, cardHeapRef: CardHeap) {
		this.socket = socket;
		this.cardHeapRef = cardHeapRef;
		this.raycaster = new THREE.Raycaster();
		
		this.socket.on('connect', () => {
			console.log(`Socket connected`);
		});
		this.socket.on('graceful_disconnect', () => {
			this.socket.disconnect();
		});
		this.socket.on('disconnect', (reason) => {
			console.log('Socket disconnected')
		})

		this.initPlayer(playerId);
	}

	private initPlayer(playerId: string) {
		this.playerId = playerId;
		this.cardManager = new CardManager(
			this.playerId,
			new THREE.Vector3(0, 2, 8),
			new THREE.Euler(0, 0, 0),
			10,
			5,
		);

		const sendCardsButton = document.getElementById('send-cards-button');
		sendCardsButton?.addEventListener('click', () => {
			const cardsJson: string = this.cardManager.selectedCardsToJSON();
			this.socket.emit('player_play_card_hand', cardsJson);
		});
		
		const skipTurnButton = document.getElementById('skip-turn-button');
		skipTurnButton?.addEventListener('click', () => {
			this.socket.emit('player_skip_turn');
		})
		
		const startGameButton = document.getElementById('start-game-button');
		startGameButton?.addEventListener('click', () => {
			this.socket.emit('game_start', this.socket.id);
		});
		
		this.socket.on('game_start', (status) => {
			console.log(`Start Game: ${status}`);
		});
		
		this.socket.on('game_end', (body) => {
			console.log(body);
		})
		
		this.socket.on('player_play_card_hand', (status) => {
			if (status === 'success') {
				const cardHand = this.cardManager.sendSelectedCards();
				this.cardHeapRef.receiveCardHand(cardHand);

			}
			else {
				console.log(`playCardHand status: ${status}`);
			}
		});
		
		this.socket.on('player_turn', () => {
			console.log('This player\'s is our turn!');
		});
		
		this.socket.on('collect_cards', (cards) => {
			const cardTransmits: Array<CardTransmit> = JSON.parse(cards) as Array<CardTransmit>;
			for (let i = 0; i < cardTransmits.length; i++) {
				let card = new Card(cardTransmits[i].rank, cardTransmits[i].suite);
				this.cardManager.receiveCard(card);
				scene.add(card.object);
			}
		})

		renderer.domElement.addEventListener('click', (event) => {
			this.eventClick(event);
		});
	}

	private eventClick(event: PointerEvent) {
		const canvas = renderer.domElement.getBoundingClientRect();
		const mouse = new THREE.Vector2();
		mouse.x = ((event.clientX - canvas.left) / canvas.width) * 2 - 1;
		mouse.y = -((event.clientY - canvas.top) / canvas.height) * 2 + 1;
		this.raycaster.setFromCamera(mouse, camera);
		this.cardManager.interactCard(this.raycaster);
	}
}