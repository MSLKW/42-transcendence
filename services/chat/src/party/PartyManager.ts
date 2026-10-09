import { Server } from "socket.io";
import { Client } from "../client/Client";
import { clientManager } from "../client/ClientManager";
import { ClientToServerEvents, ServerToClientEvents } from "../events";

type ChatServer = Server<ClientToServerEvents, ServerToClientEvents>;

export interface Party {
	hostUuid: string;
	playerUuids: Set<string>;
}

export interface PartyPayload {
	hostUuid: string;
	playerUuids: string[];
}

export class PartyManager {
	private readonly parties = new Map<string, Party>();
	private readonly playerToHost = new Map<string, string>();

	constructor(private readonly io: ChatServer) {}

	hasParty(hostUuid: string): boolean {
		return this.parties.has(hostUuid);
	}

	getParty(hostUuid: string): Party | undefined {
		return this.parties.get(hostUuid);
	}

	getHostForPlayer(playerUuid: string): string | undefined {
		return this.playerToHost.get(playerUuid);
	}

	isPlayerWhitelisted(hostUuid: string, playerUuid: string): boolean {
		const party = this.parties.get(hostUuid);
		return party?.playerUuids.has(playerUuid) ?? false;
	}

	getRoomForPlayer(playerUuid: string): string {
		return this.playerToHost.get(playerUuid) ?? playerUuid;
	}

	createParty(payload: PartyPayload): void {
		const normalized = normalizePartyPayload(payload);
		if (this.parties.has(normalized.hostUuid))
			throw new PartyConflictError(`Party<${normalized.hostUuid}> already exists`);

		this.assertHostIsNotAlreadyInAnotherParty(normalized.hostUuid);

		const party: Party = {
			hostUuid: normalized.hostUuid,
			playerUuids: new Set(normalized.playerUuids),
		};
		this.parties.set(party.hostUuid, party);

		for (const playerUuid of party.playerUuids)
			this.assignPlayerToParty(playerUuid, party.hostUuid);

		this.reconcileConnectedPlayers(party.playerUuids);
	}

	updateParty(currentHostUuid: string, payload: PartyPayload): void {
		const existingParty = this.parties.get(currentHostUuid);
		if (!existingParty)
			throw new PartyNotFoundError(`Party<${currentHostUuid}> does not exist`);

		const normalized = normalizePartyPayload(payload);
		const newHostUuid = normalized.hostUuid;
		if (newHostUuid !== currentHostUuid && this.parties.has(newHostUuid))
			throw new PartyConflictError(`Party<${newHostUuid}> already exists`);

		this.parties.delete(currentHostUuid);

		for (const playerUuid of existingParty.playerUuids) {
			if (this.playerToHost.get(playerUuid) === currentHostUuid)
				this.playerToHost.delete(playerUuid);
		}

		const updatedParty: Party = {
			hostUuid: newHostUuid,
			playerUuids: new Set(normalized.playerUuids),
		};
		this.parties.set(newHostUuid, updatedParty);

		for (const playerUuid of updatedParty.playerUuids)
			this.assignPlayerToParty(playerUuid, newHostUuid);

		for (const playerUuid of existingParty.playerUuids) {
			if (!updatedParty.playerUuids.has(playerUuid))
				this.movePlayerToSoloRoom(playerUuid);
		}

		this.reconcileConnectedPlayers(
			new Set([
				...existingParty.playerUuids,
				...updatedParty.playerUuids,
			])
		);
	}

	deleteParty(hostUuid: string): void {
		const party = this.parties.get(hostUuid);
		if (!party)
			throw new PartyNotFoundError(`Party<${hostUuid}> does not exist`);

		this.parties.delete(hostUuid);

		for (const playerUuid of party.playerUuids) {
			if (this.playerToHost.get(playerUuid) === hostUuid)
				this.playerToHost.delete(playerUuid);
			this.movePlayerToSoloRoom(playerUuid);
		}
	}

	private reconcileConnectedPlayers(playerUuids: Set<string>): void {
		for (const playerUuid of playerUuids) {
			const client = clientManager.getByUuid(playerUuid);
			if (!client)
				continue;

			const expectedRoom = this.getRoomForPlayer(playerUuid);
			if (client.roomId !== expectedRoom)
				this.moveClientToRoom(client, expectedRoom);
		}
	}

	private assignPlayerToParty(playerUuid: string, hostUuid: string): void {
		const previousHostUuid = this.playerToHost.get(playerUuid);
		if (previousHostUuid && previousHostUuid !== hostUuid) {
			const previousParty = this.parties.get(previousHostUuid);
			previousParty?.playerUuids.delete(playerUuid);

			if (this.playerToHost.get(playerUuid) === previousHostUuid)
				this.playerToHost.delete(playerUuid);
		}

		this.playerToHost.set(playerUuid, hostUuid);

		const client = clientManager.getByUuid(playerUuid);
		if (!client)
			return;

		this.moveClientToRoom(client, hostUuid);
	}

	private movePlayerToSoloRoom(playerUuid: string): void {
		const client = clientManager.getByUuid(playerUuid);
		if (!client)
			return;

		this.moveClientToRoom(client, playerUuid);
	}

	private moveClientToRoom(client: Client, newRoomId: string): void {
		const previousRoomId = client.roomId;
		if (previousRoomId === newRoomId) {
			if (!client.socket.rooms.has(newRoomId))
				client.socket.join(newRoomId);
			return;
		}

		const timestamp = new Date().toISOString();
		if (previousRoomId) {
			client.socket.leave(previousRoomId);
			this.io.to(previousRoomId).emit("chat_user_left", {
				senderUuid: client.uuid,
				timestamp,
			})
		}
		
		client.socket.join(newRoomId);
		client.roomId = newRoomId;
		client.socket.to(newRoomId).emit("chat_user_joined", {
			senderUuid: client.uuid,
			timestamp,
		});

		console.log(`User<${client.uuid}> moved chat room to ${newRoomId}`);
	}

	private assertHostIsNotAlreadyInAnotherParty(hostUuid: string): void {
		const existingHost = this.playerToHost.get(hostUuid);
		if (existingHost)
			throw new PartyConflictError(`User<${hostUuid}> is already a member of Party<${existingHost}>`);
	}
}

function normalizePartyPayload(payload: PartyPayload): PartyPayload {
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

export class ValidationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ValidationError";
	}
}

export class PartyNotFoundError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "PartyNotFoundError";
	}
}

export class PartyConflictError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "PartyConflictError";
	}
}