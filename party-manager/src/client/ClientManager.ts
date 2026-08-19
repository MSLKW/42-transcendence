import { Client } from "./Client";
import { Party } from "../party/Party";

class ClientManager
{
	private byUuid	= new Map<string, Client>();
	private bySocketId = new Map<string, Client>();

	add(client: Client)
	{
		this.byUuid.set(client.uuid, client);
		this.bySocketId.set(client.socket.id, client);
	}

	removeByUuid(uuid: string)
	{
		const client = this.byUuid.get(uuid);
		if (!client)
			return ;
		client.party?.removeUser(client.uuid);
		this.byUuid.delete(uuid);
		this.bySocketId.delete(client.socket.id);
	}
	
	removeBySocketId(socketId: string)
	{
		const client = this.bySocketId.get(socketId);
		if (!client)
			return;
		client.party?.removeUser(client.uuid);
		this.byUuid.delete(client.uuid);
		this.bySocketId.delete(socketId);
	}

	getByUuid(uuid: string): Client | undefined
	{
		return (this.byUuid.get(uuid));
	}

	getBySocketId(socketId: string): Client | undefined
	{
		return (this.bySocketId.get(socketId));
	}

	isOnline(uuid: string): boolean
	{
		return (this.byUuid.has(uuid));
	}

	rebindSocket(oldSocketId: string, newSocketId: string)
	{
		const client = this.bySocketId.get(oldSocketId);
		if (!client)
			return ;
		this.bySocketId.delete(oldSocketId);
		this.bySocketId.set(newSocketId, client);
	}

	emitToUuid(uuid: string, event: string, payload: unknown): boolean
	{
		const client = this.getByUuid(uuid);

		if (!client)
			return (false);
		client.emit(event, payload);
		return (true);
	}

	// Handy for search: filter connected clients by a predicate
	findAll(predicate: (client: Client) => boolean): Client[]
	{
		return [...this.byUuid.values()].filter(predicate);
	}
}

export const clientManager = new ClientManager();