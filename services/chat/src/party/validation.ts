import type { PartyPayload } from "./PartyManager";
import { ValidationError } from "./errors";

//validates and normalizes a party's host and member IDs
export function normalizePartyPayload(payload: PartyPayload): PartyPayload {
	if (!payload || typeof payload !== "object")
		throw new ValidationError("Request body must be an object");
	if (typeof payload.hostUuid !== "string" || !payload.hostUuid.trim())
		throw new ValidationError("hostUuid must be a non-empty string");
	if (!Array.isArray(payload.playerUuids))
		throw new ValidationError("playerUuids must be a array");

	const hostUuid = payload.hostUuid.trim();
	const playerUuids = new Set<string>();
	for (const uuid of payload.playerUuids) {
		if (typeof uuid !== "string" || !uuid.trim())
			throw new ValidationError("playerUuids must contain only non-empty strings");
		playerUuids.add(uuid.trim());
	}

	playerUuids.add(hostUuid);
	return {
		hostUuid,
		playerUuids: [...playerUuids],
	};
}
