import { Server, Socket } from "socket.io";
import { Client } from "./Client";
import { ClientToServerEvents, ServerToClientEvents } from "../events";
import { PartyManager } from "../party/PartyManager";
import { registerRoomEvents } from "./room_events";
import { registerChatActivityEvents, removeRateLimiters } from "./chat_activity_events";

//socket type used by chat event handlers
type ChatSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

//server type used by chat event handlers
type ChatServer = Server<ClientToServerEvents, ServerToClientEvents>;

//registers all client-facing chat events
export function registerEventHandlers(
	io: ChatServer,
	socket: ChatSocket,
	client: Client,
	partyManager: PartyManager,
): void {
	registerRoomEvents(socket, client, partyManager);
	registerChatActivityEvents(io, socket, client, partyManager);
}

export { removeRateLimiters };
