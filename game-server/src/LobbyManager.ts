import { io, kickSocket, LobbyRequest } from './server.js';
import { Socket } from 'socket.io';
import { Lobby } from './Lobby.js';
import { IncomingEventRegistry, EventConfig } from './Validation.js';
import { ExtendedError } from 'socket.io';
import { AUTH_SERVICE_URL } from './server.js';

export class LobbyManager {
	private lobbies: Record<string, Lobby>;
	private newSessionId: number;
	private lobbyLimit: number;

	constructor() {
		this.lobbies = {};
		this.newSessionId = 0;
		this.lobbyLimit = process.env.LOBBY_LIMIT ? Number(process.env.LOBBY_LIMIT) : 0;

		io.use(async (socket, next) => {
			if (socket.handshake.auth.botSessionToken !== undefined) {
				next();
				return ;
			}
			this.userAuthentication(socket, next);
			return ;
		});

		io.use((socket, next) => {
			const	lobbyId = socket.handshake.auth.lobbyId;
			const	lobby = this.lobbies[lobbyId];
			const	botSessionToken = socket.handshake.auth.botSessionToken;

			if (lobby === undefined) {
				next(new Error(`Lobby<${lobbyId}> not found`));
				return ;
			}
			if (botSessionToken !== undefined) {
				const botId = lobby.botSessions[botSessionToken]; // if fail to find it in bot session, then connect_error or kick socket?
				if (botId === undefined) {
					next(new Error("Identified connection as Bot however could not get the relevant bot id"));
					return ;
				}
				socket.data.uuid = botId;
			}
			console.log(`checking socket.data.uuid: ${socket.data.uuid}`);
			const uuid = socket.data.uuid;
			if (uuid === undefined || uuid === null) {
				next(new Error("Authentication failed and uuid could not be retrieved"));
				return ;
			}
			next();
		})

		io.on("connection", (socket) => {
			const lobbyId = socket.handshake.auth.lobbyId;
			const lobby = this.lobbies[lobbyId];
			const uuid = socket.data.uuid;

			socket.use((packet, next) => {
				const eventName = packet[0];
				const eventConfig: EventConfig = IncomingEventRegistry[eventName];
				if (eventConfig === undefined) {
					return (next(new Error(`Unknown Event: ${eventName}`)));
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
						return (next(new Error(`Event<"${eventName}"> does not have payload attached`)));
					}
					const payloadParseResult = eventConfig.payload.safeParse(payload);
					if (payloadParseResult.success === false) {
						return (next(new Error(`Event<"${eventName}"> payload has failed validation`)));
					}
				}
				if (eventConfig.callback !== undefined) {
					if (callback === undefined) {
						return (next(new Error(`Event<"${eventName}"> does not have callback attached`)));
					}
					const callbackParseResult = eventConfig.callback.safeParse(callback);
					if (callbackParseResult.success === false) {
						return (next(new Error(`Event<"${eventName}"> callback has failed validation`)));
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
			this.unregisterLobby(lobby);
			lobby.kickSockets();
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

	private async userAuthentication(socket: Socket, next: (err?: ExtendedError) => void) {
		const sessionToken = socket.handshake.headers.cookie
			?.split("; ")
			.find(c => c.startsWith("session_token="))
			?.split("=")[1];	
		const token = sessionToken || socket.handshake.auth?.token;
		if (!token || typeof token !== "string")
			return next(new Error("UNAUTHORIZED: no session token provided"));
	
		try
		{
			const response = await fetch(`${AUTH_SERVICE_URL}/validate`, {
				headers: {
					Cookie: socket.handshake.headers.cookie || "",
					Authorization: `Bearer ${token}`
				},
				signal: AbortSignal.timeout(5000)
			});
	
			if (!response.ok)
				return next(new Error("UNAUTHORIZED: invalid or expired session"));
			const data = await response.json();
			if (!data.userId || typeof data.userId !== "string")
			{
				console.error("Auth service returned an OK response with no valid uuid");
				return next(new Error("UNAUTHORIZED: malformed validation response"));
			}
			socket.data.uuid = data.userId;
			next();
		}
		catch (err)
		{
			console.error("Auth validation failed:", err);
			return next(new Error("UNAUTHORIZED: could not validate session"));
		}
	}
}