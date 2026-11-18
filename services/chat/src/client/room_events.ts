import { Server, Socket } from "socket.io";
import { Client } from "./Client";
import { ClientToServerEvents, ServerToClientEvents } from "../events";
import { PartyManager } from "../party/PartyManager";
import { emitPlayerCountInRoom, getPlayerCountInRoom } from "./getPlayerCountInRoom";

/** Socket type used by room event handlers */
type ChatSocket = Socket<ClientToServerEvents, ServerToClientEvents>;
type ChatServer = Server<ClientToServerEvents, ServerToClientEvents>;

/** Registers room join and leave behavior */
export function registerRoomEvents(io: ChatServer, socket: ChatSocket, client: Client, partyManager: PartyManager): void {
	socket.on("chat_join_room", async (payload, ack) => {
		const sendAck = (response: { success: boolean; roomId?: string; count?: number; reason?: string }) => {
			if (typeof ack === "function")
				ack(response);
		}

		if (!payload || typeof payload.roomId !== "string") {
			sendAck({ success: false, reason: "Invalid payload format" });
			return;
		}

		const requestedRoomId = payload.roomId.trim();
		if (!requestedRoomId) {
			sendAck({ success: false, reason: "Room ID cannot be empty" });
			return;
		}

		const isOwnSoloRoom = requestedRoomId === client.uuid;
		const isWhitelistedPartyRoom = partyManager.isPlayerWhitelisted(requestedRoomId, client.uuid);
		if (!isOwnSoloRoom && !isWhitelistedPartyRoom) {
			console.warn(`User<${client.uuid}> attempted to join unauthorized chat room<${requestedRoomId}>`);
			sendAck({ success: false, reason: "Unauthorized to join this room" });
			return;
		}

		const expectedRoom = partyManager.getRoomForPlayer(client.uuid);
		if (requestedRoomId !== expectedRoom) {
			console.warn(`User<${client.uuid}> attempted to join room ${requestedRoomId}, expected ${expectedRoom}`);
			sendAck({ success: false, reason: "Room mismatch with current party state" });
			return;
		}
		if (client.roomId === requestedRoomId) {
			if (!socket.rooms.has(requestedRoomId))
				await socket.join(requestedRoomId);
			const count = await getPlayerCountInRoom(io, requestedRoomId);
			sendAck({ success: true, roomId: requestedRoomId, count });
			void emitPlayerCountInRoom(io, requestedRoomId);
			return;
		}

		const previousRoomId = client.roomId;
		await socket.leave(previousRoomId);
		socket.to(previousRoomId).emit("chat_user_left", {
			senderUuid: client.uuid,
			timestamp: new Date().toISOString(),
		});

		client.roomId = requestedRoomId;
		await socket.join(requestedRoomId);
		socket.to(requestedRoomId).emit("chat_user_joined", {
			senderUuid: client.uuid,
			timestamp: new Date().toISOString(),
		});
		void emitPlayerCountInRoom(io, previousRoomId);
		void emitPlayerCountInRoom(io, requestedRoomId);
		console.log(`User<${client.uuid}> joined chat room: ${requestedRoomId}`);
		const count = await getPlayerCountInRoom(io, requestedRoomId);
		sendAck({ success: true, roomId: requestedRoomId, count });
	});
}
