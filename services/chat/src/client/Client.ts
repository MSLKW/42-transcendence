import { Socket } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "../events";

//socket type used by chat clients
type ChatSocket = Socket<ClientToServerEvents, ServerToClientEvents>

//stores a user's active socket and room
export class Client {
	public readonly uuid: string;
	public socket: ChatSocket;
	public roomId: string;

	//creates a connected chat client
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
