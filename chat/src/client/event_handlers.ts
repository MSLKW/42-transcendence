import { Socket, Server } from "socket.io";
import { Client } from "./Client";
import { ClientToServerEvents, ServerToClientEvents } from "../events";

type ChatSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

const MAX_MESSAGE_LENGTH = 500;

export function registerEventHandlers(
	io: Server<ClientToServerEvents, ServerToClientEvents>,
	socket: ChatSocket,
	client: Client
): void {
	socket.on("chat_join_room", (payload) => {
		if (!payload || typeof payload.roomId !== "string")
			return;

		const newRoomId = payload.roomId.trim();
		if (!newRoomId)
			return;

		const previousRoomId = client.roomId;
		if (previousRoomId === newRoomId)
			return;

		if (previousRoomId) {
			socket.leave(previousRoomId);
			socket.to(previousRoomId).emit("chat_user_left", {
				senderUuid: client.uuid,
				timestamp: new Date().toISOString()
			});
		}

		client.roomId = newRoomId;
		socket.join(newRoomId);

		socket.to(newRoomId).emit("chat_user_joined", {
			senderUuid: client.uuid,
			timestamp: new Date().toISOString()
		});
		console.log(`User<${client.uuid}> joined chat room: ${newRoomId}`);
	});

	socket.on("chat_message", (payload) => {
		if (!payload || typeof payload.message !== "string")
			return;

		const trimmedMessage = payload.message.trim();
		if (!trimmedMessage)
			return;

		if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
			console.warn(`User<${client.uuid}> sent oversized message`);
			return;
		}

		const roomId = client.roomId;
		if (!roomId || !socket.rooms.has(roomId)) {
			console.warn(`User<${client.uuid}> tried to chat in unjoined room: ${roomId}`);
			return;
		}

		const msgPayload = {
			senderUuid: client.uuid,
			message: trimmedMessage,
			timestamp: new Date().toISOString()
		};
		io.to(roomId).emit("chat_message", msgPayload);
		console.log(`<chat_message> roomId:${client.roomId} senderUuid:${msgPayload.senderUuid} message:${msgPayload.message} timestamp:${msgPayload.timestamp}`);
	});
}