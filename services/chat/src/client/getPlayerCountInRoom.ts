import { Server } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "../events";

type ChatServer = Server<ClientToServerEvents, ServerToClientEvents>;

/** Returns the number of currently connected sockets in a room. */
export async function getPlayerCountInRoom(io: ChatServer, roomId: string): Promise<number> {
	const sockets = await io.in(roomId).fetchSockets();
	console.log("sockets.length:", sockets.length);
	return sockets.length;
}

/** Sends the current connected player count to everyone still in the room. */
export async function emitPlayerCountInRoom(io: ChatServer, roomId: string): Promise<void> {
	try {
		const count = await getPlayerCountInRoom(io, roomId);
		io.to(roomId).emit("chat_room_player_count", { roomId, count });
	} catch (error) {
		console.error(`Failed to get connected player count for room<${roomId}>:`, error);
	}
}
