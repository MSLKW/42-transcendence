import express from 'express';
import type { Request, Response } from 'express';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { ExtendedError, Server, Socket } from 'socket.io';
import z from 'zod';

import { LobbyManager } from './LobbyManager.js';

const app = express();
const httpServer = createServer(app);

const PORT = process.env.PORT;
export const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;
export const GAME_BOT_SERVICE_URL = process.env.GAME_BOT_SERVICE_URL;

if (!AUTH_SERVICE_URL)
	throw new Error("AUTH_SERVICE_URL is not set");

app.use(express.json());

httpServer.listen(PORT, () => {
	console.log(`Game Server is running and listening on ${PORT}`);
});

export const io = new Server(httpServer);

const lobbyManager = new LobbyManager();

const lobbyRequestSchema = z.object({
	hostUuid: z.string().min(1), // will be replaced with z.uuid
	playerUuids: z.array(z.string()).transform((uuids) => [... new Set(uuids)])
});

export type LobbyRequest = z.infer<typeof lobbyRequestSchema>;

/* ===== Server REST Endpoints ===== */

app.get('/health', (req, res) => {
	return (res.status(204).end());
});

app.get('/lobby/:lobbySessionId', (req, res) => {
	const lobbySessionId = req.params.lobbySessionId;
	const lobby = lobbyManager.getLobby(lobbySessionId);
	if (lobby === undefined) {
		return (res.status(404).end());
	}
	return (res.status(204).end());
})

app.post('/lobby', (req, res) => {
	try {
		const payload: LobbyRequest = lobbyRequestSchema.parse(req.body);

		const sessionId = lobbyManager.createLobby(payload);
		if (sessionId.length > 0) {
			return (res.status(201).json({ lobbySessionId: sessionId }));
		}
	}
	catch (error) {
		if (error instanceof z.ZodError) {
			return (res.status(400).json({zod: error.issues}));
		}
	}
	return (res.status(500).json({error: "Server failed to create a lobby"}));
});

app.put('/lobby/:lobbySessionId', (req, res) => {
	const lobbySessionId = req.params.lobbySessionId;
	const lobby = lobbyManager.getLobby(lobbySessionId);
	if (lobby === undefined) {
		return (res.status(404).end());
	}
	try {
		const payload: LobbyRequest = lobbyRequestSchema.parse(req.body);
		if (lobby.update(payload)) {
			return (res.status(204).end());
		}
	}
	catch (error) {
		if (error instanceof z.ZodError) {
			return (res.status(400).json({zod: error.issues}));
		}
	}
	return (res.status(500).json({error: "Server failed to update the lobby"}));
});

export function kickSocket(socket: Socket, reason: string) {
	socket.emit("graceful_disconnect", reason);
	setTimeout(() => {
		socket.disconnect(true);
	}, 1000);
	// socket.removeAllListeners();
}

process.on("SIGTERM", async() => {
	io.close();
});