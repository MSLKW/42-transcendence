import { Socket } from "socket.io";
import { Client } from "./Client";
import { ClientToServerEvents, ServerToClientEvents } from "../events";

/** Socket type used by the client registry */
type ChatSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

/** Tracks active clients and delayed disconnect cleanup */
export class ClientManager {
	private readonly byUuid	= new Map<string, Client>();
	private readonly bySocketId = new Map<string, Client>();
	private readonly pendingRemovals = new Map<string, NodeJS.Timeout>();

	/** Adds a connected client to both indexes */
	add(client: Client): void {
		this.byUuid.set(client.uuid, client);
		this.bySocketId.set(client.socket.id, client);
	}

	/** Finds a client by user UUID */
	getByUuid(uuid: string): Client | undefined {
		return (this.byUuid.get(uuid));
	}

	/** Finds a client by socket ID */
	getBySocketId(socketId: string): Client | undefined {
		return (this.bySocketId.get(socketId));
	}

	/** Replaces a client's socket and returns the old one */
	rebindSocket(client: Client, socket: ChatSocket): ChatSocket {
		const oldSocket = client.socket;
		this.bySocketId.delete(oldSocket.id);

		client.socket = socket;
		this.bySocketId.set(socket.id, client);

		return oldSocket;
	}

	/** Schedules cleanup if the client does not reconnect in time */
	scheduleRemoval(uuid: string, delayMs: number, onRemove: (client: Client) => void): void {
		this.cancelRemoval(uuid);

		const client = this.byUuid.get(uuid);
		if (!client)
			return;

		const disconnectedSocketId = client.socket.id;

		const timer = setTimeout(() => {
			this.pendingRemovals.delete(uuid);

			const currentClient = this.byUuid.get(uuid);
			if (!currentClient)
				return;
			if (currentClient.socket.id !== disconnectedSocketId)
				return;

			onRemove(currentClient);
		}, delayMs);

		this.pendingRemovals.set(uuid, timer);
	}

	/** Cancels a pending cleanup for a user */
	cancelRemoval(uuid: string): void {
		const timer = this.pendingRemovals.get(uuid);
		if (!timer)
			return;

		clearTimeout(timer);
		this.pendingRemovals.delete(uuid);
	}

	/** Cancels every pending cleanup timer */
	clearAllPendingRemovals(): void {
		for (const timer of this.pendingRemovals.values())
			clearTimeout(timer);

		this.pendingRemovals.clear();
	}

	/** Removes a client from both indexes */
	removeByUuid(uuid: string): Client | undefined {
		const client = this.byUuid.get(uuid);
		if (!client)
			return undefined;

		this.cancelRemoval(uuid);
		this.byUuid.delete(uuid);
		this.bySocketId.delete(client.socket.id);

		return client;
	}
}

/** Shared registry of connected chat clients */
export const clientManager = new ClientManager();
