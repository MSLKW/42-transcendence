import { Socket } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "../events";

type ChatSocket = Socket<ClientToServerEvents, ServerToClientEvents>

export class Client {
	public readonly uuid: string;
	public socket: ChatSocket;
	public roomId: string;

	constructor(
		socket: ChatSocket,
		uuid: string,
		roomId: string
	) {
		this.socket = socket;
		this.uuid = uuid;
		this.roomId = roomId;
	}
}