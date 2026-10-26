import { Server } from "socket.io";
import { Client } from "../client/Client";
import { clientManager } from "../client/ClientManager";
import { ClientToServerEvents, ServerToClientEvents } from "../events";
import { PartyConflictError, PartyNotFoundError, ValidationError } from "./errors";
import { normalizePartyPayload } from "./validation";

export { PartyConflictError, PartyNotFoundError, ValidationError } from "./errors";

/** Server type used for party room broadcasts */
type ChatServer = Server<ClientToServerEvents, ServerToClientEvents>;

/** Stores a party host and its members */
export interface PartyState {
	hostUuid: string;
	playerUuids: Set<string>;
}

/** Describes a party received from an API request */
export interface PartyPayload {
	hostUuid: string;
	playerUuids: string[];
}

/** Manages party membership and connected players' rooms */
export class PartyManager {
	private readonly parties = new Map<string, PartyState>();
	private readonly playerToHost = new Map<string, string>();

	/** Creates a manager that can notify connected clients */
	constructor(private readonly io: ChatServer) {}

	/** Checks whether a party exists for the host */
	hasParty(hostUuid: string): boolean {
		return this.parties.has(hostUuid);
	}

	/** Returns a party by its host UUID */
	getParty(hostUuid: string): PartyState | undefined {
		return this.parties.get(hostUuid);
	}

	/** Returns the host UUID assigned to a player */
	getHostForPlayer(playerUuid: string): string | undefined {
		return this.playerToHost.get(playerUuid);
	}

	/** Checks whether a player belongs to a party */
	isPlayerWhitelisted(hostUuid: string, playerUuid: string): boolean {
		const party = this.parties.get(hostUuid);
		return party?.playerUuids.has(playerUuid) ?? false;
	}

	/** Gets the player's current party or solo room ID */
	getRoomForPlayer(playerUuid: string): string {
		return this.playerToHost.get(playerUuid) ?? playerUuid;
	}

	/** Creates a party and moves connected members into its room */
	createParty(payload: PartyPayload): void {
		const normalized = normalizePartyPayload(payload);
		if (this.parties.has(normalized.hostUuid))
			throw new PartyConflictError(`Party<${normalized.hostUuid}> already exists`);

		this.assertHostIsNotAlreadyInAnotherParty(normalized.hostUuid);

		const party: PartyState = {
			hostUuid: normalized.hostUuid,
			playerUuids: new Set(normalized.playerUuids),
		};
		this.parties.set(party.hostUuid, party);

		for (const playerUuid of party.playerUuids)
			this.assignPlayerToParty(playerUuid, party.hostUuid);

		this.reconcileConnectedPlayers(party.playerUuids);
	}

	/** Replaces a party's host or membership and updates rooms */
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

		const updatedParty: PartyState = {
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

	/** Deletes a party and returns connected members to solo rooms */
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

	/** Moves connected members into their currently assigned rooms */
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

	/** Assigns a player to a party and updates their room */
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

	/** Returns a connected player to their solo room */
	private movePlayerToSoloRoom(playerUuid: string): void {
		const client = clientManager.getByUuid(playerUuid);
		if (!client)
			return;

		this.moveClientToRoom(client, playerUuid);
	}

	/** Moves a client between Socket.IO rooms and emits presence events */
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

	/** Rejects a host who already belongs to another party */
	private assertHostIsNotAlreadyInAnotherParty(hostUuid: string): void {
		const existingHost = this.playerToHost.get(hostUuid);
		if (existingHost)
			throw new PartyConflictError(`User<${hostUuid}> is already a member of Party<${existingHost}>`);
	}
}
