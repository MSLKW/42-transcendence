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
	private cardManager!: CardManager;
	private cardHeapRef: CardHeap;
	private raycaster: THREE.Raycaster;

	constructor(playerId: string, cardHeapRef: CardHeap) {
		this.socket = io('http://localhost:3000', {
			auth: {
				token: playerId
			}
		});
		this.cardHeapRef = cardHeapRef;
		this.raycaster = new THREE.Raycaster();
		
		this.socket.on('connect', () => {
			console.log(`Socket connected`);
		});
		this.socket.on('gracefulDisconnect', () => {
			this.socket.disconnect();
		});
		this.socket.on('disconnect', (reason) => {
			console.log('Socket disconnected')
		})

		this.socket.on('initPlayer', (playerId) => {
			this.initPlayer(playerId);
		})
	}

	private initPlayer(playerId: string) {
		this.playerId = playerId;
		this.cardManager = new CardManager(
			new THREE.Vector3(-5, -3, 0), 
			new THREE.Vector3(5, -3, 0), 
			new THREE.Vector3(-2, -1.5, 0), 
			new THREE.Vector3(2, -1.5, 0), 
			this.playerId
		);

		const sendCardsButton = document.getElementById('send-cards-button');
		sendCardsButton?.addEventListener('click', () => {
			const cardsJson: string = this.cardManager.selectedCardsToJSON();
			this.socket.emit('playCardHand', cardsJson);
		});
		
		const skipTurnButton = document.getElementById('skip-turn-button');
		skipTurnButton?.addEventListener('click', () => {
			this.socket.emit('playerSkipTurn');
		})
		
		const startGameButton = document.getElementById('start-game-button');
		startGameButton?.addEventListener('click', () => {
			this.socket.emit('startGame', this.socket.id);
		});
		
		this.socket.on('startGame', (status) => {
			console.log(`Start Game: ${status}`);
		});
		
		this.socket.on('endGame', (body) => {
			console.log(body);
		})
		
		this.socket.on('playCardHand', (status) => {
			if (status === 'success') {
				const cardHand = this.cardManager.sendSelectedCards();
				cardHand.disposeCards();
			}
			else {
				console.log(`playCardHand status: ${status}`);
			}
		});
		
		this.socket.on('playerTurn', () => {
			console.log('This player\'s is our turn!');
		});
		
		this.socket.on("cardHeapUpdate", (body) => {
			const cardHandTransmit = JSON.parse(body) as CardHandTransmit;
			const cardHand = new CardHand(this.playerId);
			for (let i = 0; i < cardHandTransmit.cards.length; i++) {
				let card = new Card(cardHandTransmit.cards[i].rank, cardHandTransmit.cards[i].suite)
				cardHand.receiveCard(card);
				scene.add(card.object);
			}
			this.cardHeapRef.receiveCardHand(cardHand);
		});
		
		this.socket.on('collectCards', (cards) => {
			const cardTransmits: Array<CardTransmit> = JSON.parse(cards) as Array<CardTransmit>;
			for (let i = 0; i < cardTransmits.length; i++) {
				let card = new Card(cardTransmits[i].rank, cardTransmits[i].suite);
				this.cardManager.receiveCard(card);
				scene.add(card.object);
				// console.log(card);
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
		// console.log(`${mouse.x} | ${mouse.y}`);
		this.cardManager.interactCard(this.raycaster);
	}
}