import { io, kickSocket } from './server.js';
import { Socket } from 'socket.io';
import { Lobby } from './Lobby.js';

export class LobbyManager {
	private lobbies: Record<string, Lobby>;
	private newSessionId: number;

	constructor() {
		this.lobbies = {};
		this.newSessionId = 0;

		io.on("connection", (socket) => {
			const authId = socket.handshake.auth.token;
			const lobbyId = socket.handshake.auth.lobbyId;
			const uuid = this.authenticateSocket(authId);
			
			const lobby = this.lobbies[lobbyId];
			if (lobby !== undefined) {
				lobby.connectUser(socket, uuid);
			}
			else {
				console.log(`Lobby not found: ${lobbyId}`);
				kickSocket(socket);
			}
		});
	}

	private getSessionId(): string {
		const sessionId = this.newSessionId.toString();
		this.newSessionId++;
		return (sessionId);
	}

	public createLobby(hostUuid: string, whitelist: Array<string>, playersLimit: number): string {
		const sessionId = this.getSessionId();
		const lobby = new Lobby(hostUuid, whitelist, playersLimit, sessionId);
		lobby.events.on("lobby:inactive", () => {
			this.deleteLobby(lobby);
		})
		console.log(`Lobby<${sessionId}> created with host ${hostUuid} and whitelist: ${whitelist} `);
		this.lobbies[sessionId] = lobby;
		return (sessionId);
	}

	public deleteLobby(lobby: Lobby) {
		if (this.lobbies[lobby.sessionId] === undefined)
			return ;
		delete(this.lobbies[lobby.sessionId]);
		console.log(`Deleted Lobby<${lobby.sessionId}>`);
	}

	private authenticateSocket(authId: string): string {
		// Get associated player uuid from checking with authentication service
		// if auth service doesn't return player uuid, means that the player is not authenticated, raise some error
		return (authId);
	}
}