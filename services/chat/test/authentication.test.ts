import assert from "node:assert/strict";
import test from "node:test";
import { createSocketAuthentication } from "../src/server/authentication";

function fakeSocket(cookie = "", auth: unknown = {}) {
	return { handshake: { headers: { cookie }, auth }, data: {} as Record<string, unknown> };
}

test("rejects shutdown and missing credentials without contacting auth", async () => {
	const previousFetch = globalThis.fetch;
	let called = false;
	globalThis.fetch = (async () => { called = true; throw new Error("unexpected request"); }) as typeof fetch;
	try {
		const middleware = createSocketAuthentication("http://auth", () => true);
		let error: Error | undefined;
		await middleware(fakeSocket() as never, (value) => { error = value; });
		assert.equal(error?.message, "SERVICE_SHUTTING_DOWN");
		const active = createSocketAuthentication("http://auth", () => false);
		await active(fakeSocket() as never, (value) => { error = value; });
		assert.equal(error?.message, "UNAUTHORIZED: no session token provided");
		assert.equal(called, false);
	} finally { globalThis.fetch = previousFetch; }
});

test("validates cookie credentials, forwards them, and stores the user UUID", async () => {
	const previousFetch = globalThis.fetch;
	let requestUrl = "";
	let headers: HeadersInit | undefined;
	globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
		requestUrl = String(input);
		headers = init?.headers;
		return new Response(JSON.stringify({ userId: "user-1" }), { status: 200 });
	}) as typeof fetch;
	try {
		const socket = fakeSocket("other=value; session_token=cookie-token");
		let error: Error | undefined;
		await createSocketAuthentication("http://auth", () => false)(socket as never, (value) => { error = value; });
		assert.equal(error, undefined);
		assert.equal(socket.data.uuid, "user-1");
		assert.equal(requestUrl, "http://auth/validate");
		assert.equal(new Headers(headers).get("authorization"), "Bearer cookie-token");
	} finally { globalThis.fetch = previousFetch; }
});

test("accepts handshake token fallback and rejects invalid or malformed auth responses", async () => {
	const previousFetch = globalThis.fetch;
	const authHeaders: string[] = [];
	const bodies: unknown[] = [null, { userId: "" }];
	let index = 0;
	globalThis.fetch = (async (_input: string | URL | Request, init?: RequestInit) => {
		authHeaders.push(new Headers(init?.headers).get("authorization") ?? "");
		const body = bodies[index++];
		return new Response(JSON.stringify(body), { status: index === 1 ? 401 : 200 });
	}) as typeof fetch;
	try {
		let error: Error | undefined;
		await createSocketAuthentication("http://auth", () => false)(fakeSocket("", { token: "handshake-token" }) as never, (value) => { error = value; });
		assert.equal(error?.message, "UNAUTHORIZED: invalid or expired session");
		await createSocketAuthentication("http://auth", () => false)(fakeSocket("", { token: "another-token" }) as never, (value) => { error = value; });
		assert.equal(error?.message, "UNAUTHORIZED: malformed validation response");
		assert.deepEqual(authHeaders, ["Bearer handshake-token", "Bearer another-token"]);
	} finally { globalThis.fetch = previousFetch; }
});
