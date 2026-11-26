import assert from "node:assert/strict";
import test from "node:test";
import { PartyManager, PartyConflictError, PartyNotFoundError } from "../src/party/PartyManager";

const quietIo = { to: () => ({ emit: () => undefined }), in: () => ({ fetchSockets: async () => [] }) };

test("creates a normalized party and maps each member to its host room", () => {
	const manager = new PartyManager(quietIo as never);
	manager.createParty({ hostUuid: " host ", playerUuids: ["guest", "guest"] });
	assert.equal(manager.hasParty("host"), true);
	assert.equal(manager.getHostForPlayer("guest"), "host");
	assert.equal(manager.getRoomForPlayer("guest"), "host");
	assert.equal(manager.isPlayerWhitelisted("host", "host"), true);
	assert.equal(manager.isPlayerWhitelisted("host", "stranger"), false);
});

test("rejects duplicate parties and a host already assigned to another party", () => {
	const manager = new PartyManager(quietIo as never);
	manager.createParty({ hostUuid: "host", playerUuids: ["guest"] });
	assert.throws(() => manager.createParty({ hostUuid: "host", playerUuids: [] }), PartyConflictError);
	assert.throws(() => manager.createParty({ hostUuid: "guest", playerUuids: [] }), PartyConflictError);
});

test("updates membership and host mapping, then deletes the party", () => {
	const manager = new PartyManager(quietIo as never);
	manager.createParty({ hostUuid: "host", playerUuids: ["kept", "removed"] });
	manager.updateParty("host", { hostUuid: "new-host", playerUuids: ["kept", "added"] });
	assert.equal(manager.hasParty("host"), false);
	assert.equal(manager.getRoomForPlayer("kept"), "new-host");
	assert.equal(manager.getRoomForPlayer("removed"), "removed");
	assert.equal(manager.getRoomForPlayer("added"), "new-host");
	manager.deleteParty("new-host");
	assert.equal(manager.getRoomForPlayer("kept"), "kept");
	assert.equal(manager.hasParty("new-host"), false);
});

test("reports missing parties on update and delete", () => {
	const manager = new PartyManager(quietIo as never);
	assert.throws(() => manager.updateParty("missing", { hostUuid: "new", playerUuids: [] }), PartyNotFoundError);
	assert.throws(() => manager.deleteParty("missing"), PartyNotFoundError);
});
