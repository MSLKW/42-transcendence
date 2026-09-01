import { Socket } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "../events";

export class Client {
	public readonly uuid: string;
	public socket: Socket<ClientToServerEvents, ServerToClientEvents>;
	public roomId: string;

	constructor(
		socket: Socket<ClientToServerEvents, ServerToClientEvents>,
		uuid: string,
		roomId: string
	) {
		this.socket = socket;
		this.uuid = uuid;
		this.roomId = roomId;
	}
}