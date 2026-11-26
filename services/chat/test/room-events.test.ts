import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import test from "node:test";
import { Client } from "../src/client/Client";
import { registerRoomEvents } from "../src/client/room_events";
import { PartyManager } from "../src/party/PartyManager";

class RoomSocket extends EventEmitter {
	readonly rooms = new Set<string>();
	async join(room: string) { this.rooms.add(room); }
	async leave(room: string) { this.rooms.delete(room); }
	to(_room: string) { return { emit: () => undefined }; }
}

test("rejects malformed, unauthorized, and out-of-date room joins", async () => {
	const socket = new RoomSocket();
	const client = new Client(socket as never, "guest", "guest");
	socket.rooms.add("guest");
	const parties = new PartyManager({ to: () => ({ emit: () => undefined }), in: () => ({ fetchSockets: async () => [] }) } as never);
	parties.createParty({ hostUuid: "host", playerUuids: ["guest"] });
	registerRoomEvents({ to: () => ({ emit: () => undefined }), in: () => ({ fetchSockets: async () => [] }) } as never, socket as never, client, parties);

	assert.deepEqual(await join(socket, null), { success: false, reason: "Invalid payload format" });
	assert.deepEqual(await join(socket, { roomId: "intruder" }), { success: false, reason: "Unauthorized to join this room" });
	assert.deepEqual(await join(socket, { roomId: "guest" }), { success: false, reason: "Room mismatch with current party state" });
});

test("joins the assigned party room and acknowledges the connected count", async () => {
	const socket = new RoomSocket();
	const client = new Client(socket as never, "guest-2", "guest-2");
	socket.rooms.add("guest-2");
	const parties = new PartyManager({ to: () => ({ emit: () => undefined }), in: () => ({ fetchSockets: async () => [] }) } as never);
	parties.createParty({ hostUuid: "host-2", playerUuids: ["guest-2"] });
	const io = { to: () => ({ emit: () => undefined }), in: () => ({ fetchSockets: async () => [{}, {}] }) };
	registerRoomEvents(io as never, socket as never, client, parties);
	assert.deepEqual(await join(socket, { roomId: "host-2" }), { success: true, roomId: "host-2", count: 2 });
	assert.equal(client.roomId, "host-2");
	assert.equal(socket.rooms.has("guest-2"), false);
	assert.equal(socket.rooms.has("host-2"), true);
});

function join(socket: RoomSocket, payload: unknown): Promise<unknown> {
	return new Promise((resolve) => socket.emit("chat_join_room", payload, resolve));
}
