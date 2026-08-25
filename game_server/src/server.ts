import express from 'express';
import type { Request, Response } from 'express';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server, Socket } from 'socket.io';
import z from 'zod';

import { LobbyManager } from './LobbyManager.js';

const app = express();
const httpServer = createServer(app);
const port = 3000;

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;

if (!AUTH_SERVICE_URL)
	throw new Error("AUTH_SERVICE_URL is not set");

app.use(express.static('dist'));

app.use(express.json());

httpServer.listen(port, () => {
	console.log(`Server is running on ${port}`);
});

export const io = new Server(httpServer);

io.use(async (socket, next) => {
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
});

const lobbyManager = new LobbyManager();

const lobbyRequestSchema = z.object({
	hostUuid: z.string().min(1), // will be replaced with z.uuid
	playerUuids: z.array(z.string()).transform((uuids) => [... new Set(uuids)])
});

export type LobbyRequest = z.infer<typeof lobbyRequestSchema>;

app.get('/health', (req, res) => {
	return (res.status(204).end());
});

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


export function kickSocket(socket: Socket) {
	socket.emit("graceful_disconnect");
	setTimeout(() => {
		socket.disconnect(true);
	}, 1000);
	// socket.removeAllListeners();
}