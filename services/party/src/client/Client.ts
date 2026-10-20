import { Socket } from "socket.io";
import { Party } from "../party/Party"

export class Client
{
	public readonly uuid: string;
	public socket: Socket;
	public party: Party;

	constructor(uuid: string, socket: Socket)
	{
		this.uuid = uuid;
		this.socket = socket;
		this.party = new Party(this);
		this.emitState();
	}

	emitState()
	{
		this.emit("party_state", this.party.getState()); 
	}

	emit(event: string, payload: unknown) {
		this.socket.emit(event, payload);
	}
}