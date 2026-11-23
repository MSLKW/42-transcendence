import assert from "node:assert/strict";
import test from "node:test";
import { ValidationError } from "../src/party/errors";
import { normalizePartyPayload } from "../src/party/validation";

test("normalizes party identifiers, removes duplicates, and adds the host", () => {
	assert.deepEqual(normalizePartyPayload({
		hostUuid: " host ",
		playerUuids: [" player ", "player", "host"],
	}), { hostUuid: "host", playerUuids: ["player", "host"] });
});

test("rejects malformed party payloads", () => {
	for (const payload of [
		undefined,
		{ hostUuid: " ", playerUuids: [] },
		{ hostUuid: "host", playerUuids: "player" },
		{ hostUuid: "host", playerUuids: ["player", " "] },
	]) {
		assert.throws(() => normalizePartyPayload(payload as never), ValidationError);
	}
});
