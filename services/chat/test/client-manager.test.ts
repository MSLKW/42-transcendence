import assert from "node:assert/strict";
import test from "node:test";
import { Client } from "../src/client/Client";
import { ClientManager } from "../src/client/ClientManager";

function client(socketId: string, uuid = "user") {
	return new Client({ id: socketId } as never, uuid, "room");
}

test("indexes clients by UUID and socket, then updates both indexes when rebound", () => {
	const manager = new ClientManager();
	const original = client("socket-old");
	manager.add(original);
	assert.equal(manager.getByUuid("user"), original);
	assert.equal(manager.getBySocketId("socket-old"), original);
	const oldSocket = manager.rebindSocket(original, { id: "socket-new" } as never);
	assert.equal((oldSocket as { id: string }).id, "socket-old");
	assert.equal(manager.getBySocketId("socket-old"), undefined);
	assert.equal(manager.getBySocketId("socket-new"), original);
	assert.equal(manager.removeByUuid("user"), original);
	assert.equal(manager.getBySocketId("socket-new"), undefined);
});

test("delayed cleanup can be canceled and only removes the socket that scheduled it", async () => {
	const manager = new ClientManager();
	const first = client("first");
	manager.add(first);
	let removed = 0;
	manager.scheduleRemoval("user", 10, () => { removed++; });
	manager.cancelRemoval("user");
	await new Promise((resolve) => setTimeout(resolve, 15));
	assert.equal(removed, 0);

	manager.scheduleRemoval("user", 10, () => { removed++; });
	manager.rebindSocket(first, { id: "replacement" } as never);
	await new Promise((resolve) => setTimeout(resolve, 15));
	assert.equal(removed, 0);
	manager.scheduleRemoval("user", 10, () => { removed++; });
	await new Promise((resolve) => setTimeout(resolve, 15));
	assert.equal(removed, 1);
	manager.clearAllPendingRemovals();
});
