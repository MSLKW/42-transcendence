import { io, kickSocket, LobbyRequest } from './server.js';
import { Socket } from 'socket.io';
import { Lobby } from './Lobby.js';

export class LobbyManager {
	private lobbies: Record<string, Lobby>;
	private newSessionId: number;
	private lobbyLimit: number;

	constructor() {
		this.lobbies = {};
		this.newSessionId = 0;
		this.lobbyLimit = 100;

		io.on("connection", (socket) => {
			const authId = socket.handshake.auth.token;
			const lobbyId = socket.handshake.auth.lobbyId;
			const uuid = this.authenticateSocket(authId);
			
			const lobby = this.lobbies[lobbyId];
			if (lobby !== undefined) {
				lobby.connectUser(socket, uuid);
			}
			else {
				console.log(`Lobby<${lobbyId}> not found`);
				kickSocket(socket);
			}
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
		lobby.events.on("lobby:inactive", () => {
			this.deleteLobby(lobby);
		})
		console.log(`Lobby<${sessionId}> created with Host<${data.hostUuid}> and whitelist: [${data.playerUuids}]`);
		this.lobbies[sessionId] = lobby;
		return (sessionId);
	}

	public getLobby(sessionId: string): Lobby | undefined {
		return (this.lobbies[sessionId]);
	}

	public deleteLobby(lobby: Lobby) {
		if (this.lobbies[lobby.sessionId] === undefined)
			return ;
		delete(this.lobbies[lobby.sessionId]);
		console.log(`Lobby<${lobby.sessionId}> deleted`);
	}

	private authenticateSocket(authId: string): string {
		// Get associated player uuid from checking with authentication service
		// if auth service doesn't return player uuid, means that the player is not authenticated, raise some error
		return (authId);
	}
}