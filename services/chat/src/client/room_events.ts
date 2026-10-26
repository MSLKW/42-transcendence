import { Socket } from "socket.io";
import { Client } from "./Client";
import { ClientToServerEvents, ServerToClientEvents } from "../events";
import { PartyManager } from "../party/PartyManager";

/** Socket type used by room event handlers */
type ChatSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

/** Registers room join and leave behavior */
export function registerRoomEvents(socket: ChatSocket, client: Client, partyManager: PartyManager): void {
	socket.on("chat_join_room", (payload, ack) => {
		const sendAck = (response: { success: boolean; roomId?: string; reason?: string }) => {
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
				socket.join(requestedRoomId);
			sendAck({ success: true, roomId: requestedRoomId });
			return;
		}

		const previousRoomId = client.roomId;
		socket.leave(previousRoomId);
		socket.to(previousRoomId).emit("chat_user_left", {
			senderUuid: client.uuid,
			timestamp: new Date().toISOString(),
		});

		client.roomId = requestedRoomId;
		socket.join(requestedRoomId);
		socket.to(requestedRoomId).emit("chat_user_joined", {
			senderUuid: client.uuid,
			timestamp: new Date().toISOString(),
		});
		console.log(`User<${client.uuid}> joined chat room: ${requestedRoomId}`);
		sendAck({ success: true, roomId: requestedRoomId });
	});
}