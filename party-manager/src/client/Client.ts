import { Socket } from "socket.io";
import { Party } from "../party/Party"

export type ClientStatus = "available" | "in_party" | "in_game";

export class Client
{
	public readonly uuid: string;
	public socket: Socket;
	public username: string;
	public status: ClientStatus = "available";
	public party: Party | null = null;

	constructor(uuid: string, username: string, socket: Socket)
	{
		this.uuid = uuid;
		this.username = username;
		this.socket = socket;
	}

	emit(event: string, payload: unknown) {
		this.socket.emit(event, payload);
	}
}