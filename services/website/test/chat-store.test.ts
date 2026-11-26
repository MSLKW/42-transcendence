import assert from "node:assert/strict";
import test from "node:test";
import { useChatStore } from "../src/store/ChatStore";

test("caches only the latest 100 chat entries", () => {
	const store = useChatStore.getState();
	store.resetValues();
	for (let i = 0; i < 105; i++)
		useChatStore.getState().addToCachedChat("MESSAGE", `u${i}`, `Player ${i}`, undefined, `message ${i}`);
	const log = useChatStore.getState().chatLog;
	assert.equal(log.length, 100);
	assert.equal(log[0].uuid, "u5");
	assert.equal(log.at(-1)?.uuid, "u104");
	useChatStore.getState().resetValues();
});

test("rate limit state can be raised and reset", () => {
	useChatStore.getState().resetValues();
	useChatStore.getState().rateLimitedIsTrue();
	assert.equal(useChatStore.getState().isChatRateLimited, true);
	useChatStore.getState().resetValues();
	assert.equal(useChatStore.getState().isChatRateLimited, false);
});
