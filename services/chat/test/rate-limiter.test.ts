import assert from "node:assert/strict";
import test from "node:test";
import { RateLimiter } from "../src/utils/RateLimiter";

test("limits each client independently and allows requests after the rolling window", async () => {
	const limiter = new RateLimiter({ maxRequests: 2, windowMs: 20 });
	assert.equal(limiter.allow("alice"), true);
	assert.equal(limiter.allow("alice"), true);
	assert.equal(limiter.allow("alice"), false);
	assert.equal(limiter.allow("bob"), true);
	await new Promise((resolve) => setTimeout(resolve, 25));
	assert.equal(limiter.allow("alice"), true);
});

test("remove clears one client's history", () => {
	const limiter = new RateLimiter({ maxRequests: 1, windowMs: 1000 });
	assert.equal(limiter.allow("alice"), true);
	limiter.remove("alice");
	assert.equal(limiter.allow("alice"), true);
});
