import { Socket } from 'socket.io-client';
import { CardManager } from './CardManager';
import { CardHeap } from './CardHeap';
import { type GameStateTransmit } from '@big2/game-types';

export abstract class Participant {
	protected	socket: Socket;
	protected	cardHeapRef: CardHeap;
	public		uuid: string;
	public		cardManager: CardManager;

	constructor(socket: Socket, uuid: string, cardHeapRef: CardHeap) {
		this.socket = socket;
		this.uuid = uuid;
		this.cardHeapRef = cardHeapRef;
		this.cardManager = new CardManager(this.uuid);
	}

	public abstract sync(gameState: GameStateTransmit): void;
}