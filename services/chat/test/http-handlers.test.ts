import assert from "node:assert/strict";
import { Readable } from "node:stream";
import test from "node:test";
import { createHttpRequestHandler } from "../src/http/handlers";
import { PartyManager } from "../src/party/PartyManager";

function makeManager() {
	return new PartyManager({ to: () => ({ emit: () => undefined }), in: () => ({ fetchSockets: async () => [] }) } as never);
}

async function callHandler(method: string, url: string, body?: string, shuttingDown = false, manager = makeManager()) {
	const req = Object.assign(Readable.from(body === undefined ? [] : [body]), { method, url });
	const response = {
		statusCode: 200,
		headers: {} as Record<string, string>,
		body: "",
		setHeader(name: string, value: string) { this.headers[name] = value; },
		end(value?: string) { this.body = value ?? ""; },
	};
	await createHttpRequestHandler(manager, () => shuttingDown)(req as never, response as never);
	return { status: response.statusCode, body: response.body ? JSON.parse(response.body) : undefined };
}

test("health endpoint returns 204 and shutdown returns 503", async () => {
	assert.deepEqual(await callHandler("GET", "/health"), { status: 204, body: undefined });
	assert.deepEqual(await callHandler("GET", "/health", undefined, true), {
		status: 503, body: { error: "Service is shutting down" },
	});
});

test("party routes create, update, delete, and return expected errors", async () => {
	const manager = makeManager();
	const call = (method: string, url: string, body?: string) => callHandler(method, url, body, false, manager);
	const create = await call("POST", "/party", JSON.stringify({ hostUuid: " host ", playerUuids: ["guest", "guest"] }));
	assert.equal(create.status, 201);
	assert.deepEqual(create.body, { hostUuid: "host", playerUuids: ["guest", "host"] });
	assert.equal((await call("POST", "/party", JSON.stringify({ hostUuid: "host", playerUuids: [] }))).status, 409);
	assert.equal((await call("PUT", "/party/host", JSON.stringify({ hostUuid: "renamed", playerUuids: ["guest"] }))).status, 204);
	assert.equal((await call("DELETE", "/party/renamed")).status, 204);
	assert.equal((await call("DELETE", "/party/renamed")).status, 404);
});

test("party routes reject missing and malformed JSON bodies", async () => {
	assert.equal((await callHandler("POST", "/party")).status, 400);
	assert.equal((await callHandler("POST", "/party", "{")).status, 400);
	assert.equal((await callHandler("GET", "/unknown")).status, 404);
});
