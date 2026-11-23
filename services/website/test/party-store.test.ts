import assert from "node:assert/strict";
import test from "node:test";
import { usePartyStore } from "../src/store/PartyStore";

test("kick and availability actions update party state immutably", () => {
	usePartyStore.setState({ members: ["host", "guest", null], availabilityOverrides: {} });
	usePartyStore.getState().kickPlayer("guest");
	assert.deepEqual(usePartyStore.getState().members, ["host", null]);
	usePartyStore.getState().setAvailability("host", "Busy");
	assert.equal(usePartyStore.getState().availabilityOverrides.host, "Busy");
	usePartyStore.getState().clearAvailability("host");
	assert.deepEqual(usePartyStore.getState().availabilityOverrides, {});
	usePartyStore.getState().resetValues();
});

test("reset clears party membership and identifiers", () => {
	usePartyStore.setState({ members: ["host"], hostUuid: "host", partyGameId: "game", partySocketId: "socket" });
	usePartyStore.getState().resetValues();
	assert.deepEqual(usePartyStore.getState().members, []);
	assert.equal(usePartyStore.getState().hostUuid, null);
	assert.equal(usePartyStore.getState().partyGameId, null);
	assert.equal(usePartyStore.getState().partySocketId, null);
});
