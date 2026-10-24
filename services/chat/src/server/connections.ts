import { DisconnectReason, Server, Socket } from "socket.io";
import { Client } from "../client/Client";
import { clientManager } from "../client/ClientManager";
import { registerEventHandlers, removeRateLimiters } from "../client/event_handlers";
import { ClientToServerEvents, ServerToClientEvents } from "../events";
import { PartyManager } from "../party/PartyManager";

//socket type used by connection lifecycle handlers
type ChatSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

//server type used by connection lifecycle handlers
type ChatServer = Server<ClientToServerEvents, ServerToClientEvents>;

const reconnectGracePeriodMs = Number(process.env.DISCONNECT_GRACE_PERIOD_MS) || 15_000;
const permanentDisconnectReasons = new Set([
	"server namespace disconnect",
	"client namespace disconnect",
]);

//registers connection, reconnection, and disconnect behavior
export function registerConnections(
	io: ChatServer,
	partyManager: PartyManager,
	isShuttingDown: () => boolean,
): void {
	io.on("connection", (socket: ChatSocket) => {
		if (isShuttingDown()) {
			socket.disconnect(true);
			return;
		}

		const uuid = socket.data.uuid;
		if (!uuid) {
			socket.disconnect(true);
			return;
		}

		const existing = clientManager.getByUuid(uuid);
		if (existing) {
			clientManager.cancelRemoval(uuid);

			const expectedRoom = partyManager.getRoomForPlayer(uuid);
			if (existing.roomId !== expectedRoom)
				existing.roomId = expectedRoom;
			socket.join(existing.roomId);
			registerEventHandlers(io, socket, existing, partyManager);

			const oldSocket = clientManager.rebindSocket(existing, socket);
			oldSocket.disconnect(true);
			console.log(`User<${uuid}> reconnected on socket<${socket.id}> in room ${existing.roomId}`);
		} else {
			const roomId = partyManager.getRoomForPlayer(uuid);
			const client = new Client(socket, uuid, roomId);
			clientManager.add(client);
			socket.join(roomId);
			registerEventHandlers(io, socket, client, partyManager);
			console.log(`User<${uuid}> connected on socket ${socket.id} in room ${roomId}`);
		}

		socket.on("disconnect", (reason: DisconnectReason) => {
			if (isShuttingDown())
				return;

			const client = clientManager.getBySocketId(socket.id);
			if (!client || client.socket.id !== socket.id)
				return;

			if (permanentDisconnectReasons.has(reason)) {
				removeRateLimiters(client.uuid);
				finalizeRemoval(io, client.uuid, reason);
				return;
			}

			clientManager.scheduleRemoval(uuid, reconnectGracePeriodMs, (disconnectedClient) => {
				removeRateLimiters(disconnectedClient.uuid);
				finalizeRemoval(io, disconnectedClient.uuid, "reconnection grace period ended");
			});
			console.log(`User<${uuid}> disconnected (${reason}). Waiting ${reconnectGracePeriodMs}ms`);
		});
	});
}

//removes a disconnected client and notifies its room
function finalizeRemoval(io: ChatServer, uuid: string, reason: string): void {
	const client = clientManager.removeByUuid(uuid);
	if (!client)
		return;

	io.to(client.roomId).emit("chat_user_left", {
		senderUuid: uuid,
		timestamp: new Date().toISOString(),
	});
	console.log(`User<${uuid}> disconnected - ${reason}`);
}
