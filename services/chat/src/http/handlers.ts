import { IncomingMessage, ServerResponse } from "http";
import {
	PartyConflictError,
	PartyManager,
	PartyNotFoundError,
	PartyPayload,
} from "../party/PartyManager";
import { ValidationError } from "../party/errors";

/** Creates the HTTP handler for health checks and party routes */
export function createHttpRequestHandler(
	partyManager: PartyManager,
	isShuttingDown: () => boolean,
): (req: IncomingMessage, res: ServerResponse) => Promise<void> {
	return async (req, res) => {
		if (isShuttingDown()) {
			sendJson(res, 503, { error: "Service is shutting down" });
			return;
		}

		try {
			const method = req.method || "GET";
			const url = new URL(req.url || "/", "http://localhost");

			if (method === "GET" && url.pathname === "/health") {
				res.statusCode = 204;
				res.end();
				return;
			}

			if (method === "POST" && url.pathname === "/party") {
				const payload = validatePartyPayload(await readJsonBody(req));
				partyManager.createParty(payload);
				sendJson(res, 201, {
					hostUuid: payload.hostUuid,
					playerUuids: payload.playerUuids,
				});
				return;
			}

			if (method === "PUT" && url.pathname.startsWith("/party/")) {
				const currentHostUuid = decodeURIComponent(url.pathname.slice("/party/".length));
				if (!currentHostUuid) {
					sendJson(res, 400, { error: "hostUuid is required" });
					return;
				}

				const payload = validatePartyPayload(await readJsonBody(req));
				partyManager.updateParty(currentHostUuid, payload);
				res.statusCode = 204;
				res.end();
				return;
			}

			if (method === "DELETE" && url.pathname.startsWith("/party/")) {
				const hostUuid = decodeURIComponent(url.pathname.slice("/party/".length));
				if (!hostUuid) {
					sendJson(res, 400, { error: "hostUuid is required" });
					return;
				}

				partyManager.deleteParty(hostUuid);
				res.statusCode = 204;
				res.end();
				return;
			}

			sendJson(res, 404, { error: "Not found" });
		} catch (error) {
			handleHttpError(res, error);
		}
	};
}

/** Checks the shape of a party request body */
function validatePartyPayload(body: unknown): PartyPayload {
	if (!body || typeof body !== "object")
		throw new ValidationError("Request body must be an object");

	const value = body as Record<string, unknown>;
	if (typeof value.hostUuid !== "string")
		throw new ValidationError("hostUuid must be a string");
	if (!Array.isArray(value.playerUuids))
		throw new ValidationError("playerUuids must be an array");

	return {
		hostUuid: value.hostUuid,
		playerUuids: value.playerUuids as string[],
	};
}

/** Reads and parses a bounded JSON request body */
async function readJsonBody(req: IncomingMessage): Promise<unknown> {
	const chunks: Buffer[] = [];
	let size = 0;
	const maxBodySize = 1024 * 1024;

	for await (const chunk of req) {
		const buffer = Buffer.from(chunk);
		size += buffer.length;
		if (size > maxBodySize)
			throw new ValidationError("Request body is too large");
		chunks.push(buffer);
	}

	if (size === 0)
		throw new ValidationError("Request body is required");

	try {
		return JSON.parse(Buffer.concat(chunks).toString("utf8"));
	} catch {
		throw new ValidationError("Request body must contain valid JSON");
	}
}

/** Sends a JSON response with the given status */
function sendJson(res: ServerResponse, statusCode: number, body: unknown): void {
	res.statusCode = statusCode;
	res.setHeader("Content-Type", "application/json");
	res.end(JSON.stringify(body));
}

/** Converts known request errors into HTTP responses */
function handleHttpError(res: ServerResponse, error: unknown): void {
	if (error instanceof ValidationError) {
		sendJson(res, 400, { error: error.message });
		return;
	}
	if (error instanceof PartyNotFoundError) {
		sendJson(res, 404, { error: error.message });
		return;
	}
	if (error instanceof PartyConflictError) {
		sendJson(res, 409, { error: error.message });
		return;
	}

	console.error("Unhandled HTTP error:", error);
	sendJson(res, 500, { error: "Internal server error" });
}
