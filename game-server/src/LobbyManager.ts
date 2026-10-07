import { io, kickSocket, LobbyRequest } from './server.js';
import { Socket } from 'socket.io';
import { Lobby } from './Lobby.js';
import { IncomingEventRegistry, EventConfig } from './Validation.js';

export class LobbyManager {
	private lobbies: Record<string, Lobby>;
	private newSessionId: number;
	private lobbyLimit: number;

	constructor() {
		this.lobbies = {};
		this.newSessionId = 0;
		this.lobbyLimit = process.env.LOBBY_LIMIT ? Number(process.env.LOBBY_LIMIT) : 0;

		io.use((socket, next) => {
			const lobbyId = socket.handshake.auth.lobbyId;
			const uuid = socket.data.uuid;
			const lobby = this.lobbies[lobbyId];
			if (uuid === undefined || uuid === null) {
				const error = new Error("Authentication failed and uuid could not be retrieved");
				next(error);
				return ;
			}
			if (lobby === undefined) {
				const error = new Error(`Lobby<${lobbyId}> not found`);
				next(error);
				return ;
			}
			next();
		})

		io.on("connection", (socket) => {
			const lobbyId = socket.handshake.auth.lobbyId;
			const uuid = socket.data.uuid;
			const lobby = this.lobbies[lobbyId];

			socket.use((packet, next) => {
				const eventName = packet[0];
				const eventConfig: EventConfig = IncomingEventRegistry[eventName];
				if (eventConfig === undefined) {
					return (next(new Error("Unknown Event")));
				}
				let callback = undefined;
				if (typeof packet[packet.length - 1] === 'function') {
					callback = packet[packet.length - 1];
				}
				let payload = undefined;
				if (packet[1] !== callback) {
					payload = packet[1];
				}
				if (eventConfig.payload !== undefined) {
					if (payload === undefined) {
						return (next(new Error("Event does not have payload attached")));
					}
					const payloadParseResult = eventConfig.payload.safeParse(payload);
					if (payloadParseResult.success === false) {
						return (next(new Error("Event payload has failed validation")));
					}
				}
				if (eventConfig.callback !== undefined) {
					if (callback === undefined) {
						return (next(new Error("Event does not have callback attached")));
					}
					const callbackParseResult = eventConfig.callback.safeParse(callback);
					if (callbackParseResult.success === false) {
						return (next(new Error("Event callback has failed validation")));
					}
				}
				next();
			});

			socket.on("error", (error) => {
				console.log("Received 'error': ", error.message);
			});
			
			lobby.connectUser(socket, uuid);
		});
	}

	private getNewSessionId(): string {
		const sessionId = this.newSessionId.toString();
		this.newSessionId++;
		return (sessionId);
	}

	// Will return empty sessionId if cannot create lobby
	public createLobby(data: LobbyRequest): string {
		if (Object.keys(this.lobbies).length >= this.lobbyLimit) {
			return ("");
		}
		const sessionId = this.getNewSessionId();
		const lobby = new Lobby(data, sessionId);
		lobby.events.on("lobby:delete", () => {
			lobby.kickSockets();
			this.unregisterLobby(lobby);
		})
		console.log(`Lobby<${sessionId}> created with Host<${data.hostUuid}> and whitelist: [${data.playerUuids}]`);
		this.lobbies[sessionId] = lobby;
		return (sessionId);
	}

	public getLobby(sessionId: string): Lobby | undefined {
		return (this.lobbies[sessionId]);
	}

	public unregisterLobby(lobby: Lobby) {
		if (this.lobbies[lobby.sessionId] === undefined)
			return ;
		delete(this.lobbies[lobby.sessionId]);
		console.log(`Lobby<${lobby.sessionId}> is unregistered`);
	}
}