import { Socket } from 'socket.io-client';
import { CardManager } from './CardManager.ts';
import { CardHeap } from './CardHeap.ts';
import { GameStateTransmit } from '@bigtwo/shared';

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