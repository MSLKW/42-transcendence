import { Socket } from "socket.io";
import { Client } from "./Client";
import { ClientToServerEvents, ServerToClientEvents } from "../events";

type ChatSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

export class ClientManager {
	private readonly byUuid	= new Map<string, Client>();
	private readonly bySocketId = new Map<string, Client>();
	private readonly pendingRemovals = new Map<string, NodeJS.Timeout>();

	add(client: Client): void {
		this.byUuid.set(client.uuid, client);
		this.bySocketId.set(client.socket.id, client);
	}

	getByUuid(uuid: string): Client | undefined {
		return (this.byUuid.get(uuid));
	}

	getBySocketId(socketId: string): Client | undefined {
		return (this.bySocketId.get(socketId));
	}

	rebindSocket(client: Client, socket: ChatSocket): ChatSocket {
		const oldSocket = client.socket;
		this.bySocketId.delete(oldSocket.id);

		client.socket = socket;
		this.bySocketId.set(socket.id, client);
		return oldSocket;
	}

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

	cancelRemoval(uuid: string): void {
		const timer = this.pendingRemovals.get(uuid);
		if (!timer)
			return;

		clearTimeout(timer);
		this.pendingRemovals.delete(uuid);
	}

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

export const clientManager = new ClientManager();