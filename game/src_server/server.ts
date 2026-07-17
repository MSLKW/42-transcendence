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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static('dist'));

app.use(express.json());

httpServer.listen(port, () => {
	console.log(`Server is running on ${port}`);
});

export const io = new Server(httpServer);

const lobbyManager = new LobbyManager();

const lobbyRequestSchema = z.object({
	hostUuid: z.string().min(1), // will be replaced with z.uuid
	playersLimit: z.number(),
	whitelist: z.array(z.string())
});

type LobbyRequest = z.infer<typeof lobbyRequestSchema>;

/*
	Exposed internally for party manager to request
	{
		"hostUuid": "",
		"playersLimit": 4,
		"whitelist": ["id1", "id2", "id3"]
	}
*/
app.post('/api/game/lobby', (req, res) => {
	try {
		const payload: LobbyRequest = lobbyRequestSchema.parse(req.body);

		const sessionId = lobbyManager.createLobby(payload.hostUuid, payload.whitelist, payload.playersLimit);
		return (res.status(200).json({ sessionId: sessionId }));
	} 
	catch(error) {
		if (error instanceof z.ZodError) {
			return (res.status(400).json(error.issues));
		}
	}
});

export function kickSocket(socket: Socket) {
	socket.emit("graceful_disconnect");
	setTimeout(() => {
		socket.disconnect(true);
	}, 1000);
	// socket.removeAllListeners();
}