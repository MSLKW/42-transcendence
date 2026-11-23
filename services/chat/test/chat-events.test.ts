import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import test from "node:test";
import { Client } from "../src/client/Client";
import { clientManager } from "../src/client/ClientManager";
import { registerChatActivityEvents } from "../src/client/chat_activity_events";
import { PartyManager } from "../src/party/PartyManager";

class FakeSocket extends EventEmitter {
	readonly rooms = new Set<string>();
	readonly outbound: Array<{ room: string; event: string; payload: unknown }> = [];
	constructor(readonly id: string) { super(); }
	to(room: string) {
		return { emit: (event: string, payload: unknown) => this.outbound.push({ room, event, payload }) };
	}
}

function setup(uuid: string) {
	const socket = new FakeSocket(`socket-${uuid}`);
	const client = new Client(socket as never, uuid, "host-room");
	socket.rooms.add("host-room");
	const ioEvents: Array<{ room: string; event: string; payload: unknown }> = [];
	const io = { to: (room: string) => ({ emit: (event: string, payload: unknown) => ioEvents.push({ room, event, payload }) }) };
	const parties = new PartyManager(io as never);
	parties.createParty({ hostUuid: "host-room", playerUuids: [uuid] });
	clientManager.add(client);
	registerChatActivityEvents(io as never, socket as never, client, parties);
	return { socket, client, ioEvents, cleanup: () => clientManager.removeByUuid(uuid) };
}

test("broadcasts trimmed valid messages and ignores invalid payloads", () => {
	const { socket, ioEvents, cleanup } = setup("chat-message-user");
	try {
		socket.emit("chat_message", { type: "MESSAGE", message: "  hello room  " });
		assert.equal(ioEvents.length, 1);
		assert.equal(ioEvents[0].room, "host-room");
		assert.equal(ioEvents[0].event, "chat_message");
		assert.deepEqual(ioEvents[0].payload, {
			senderUuid: "chat-message-user", type: "MESSAGE", message: "hello room",
			timestamp: (ioEvents[0].payload as { timestamp: string }).timestamp,
		});
		assert.ok(Number.isFinite(Date.parse((ioEvents[0].payload as { timestamp: string }).timestamp)));
		socket.emit("chat_message", { type: "MESSAGE", message: "   " });
		socket.emit("chat_message", { type: "SYSTEM", message: "hello" });
		socket.emit("chat_message", { type: "EMOTE", message: "x".repeat(501) });
		assert.equal(ioEvents.length, 1);
	} finally { cleanup(); }
});

test("broadcasts typing to the room and ignores invalid or stale sockets", () => {
	const { socket, client, cleanup } = setup("typing-user");
	try {
		socket.emit("chat_typing", { isTyping: true });
		assert.deepEqual(socket.outbound.at(-1), {
			room: "host-room", event: "chat_user_typing", payload: { senderUuid: "typing-user", isTyping: true },
		});
		const count = socket.outbound.length;
		socket.emit("chat_typing", { isTyping: "yes" });
		clientManager.removeByUuid("typing-user");
		socket.emit("chat_typing", { isTyping: false });
		assert.equal(socket.outbound.length, count);
	} finally { cleanup(); }
});
