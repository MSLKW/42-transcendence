import { Server, Socket } from "socket.io";
import { Client } from "./Client";
import { ClientToServerEvents, ServerToClientEvents } from "../events";
import { PartyManager } from "../party/PartyManager";
import { registerRoomEvents } from "./room_events";
import { registerChatActivityEvents, removeRateLimiters } from "./chat_activity_events";

/** Socket type used by chat event handlers */
type ChatSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

/** Server type used by chat event handlers */
type ChatServer = Server<ClientToServerEvents, ServerToClientEvents>;

/** Registers all client-facing chat events */
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
