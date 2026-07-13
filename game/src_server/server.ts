import express from 'express';
import type { Request, Response } from 'express';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import z from 'zod';

import { Lobby } from './Lobby.js';

const app = express();
const httpServer = createServer(app);
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// app.get('/', (req: Request, res: Response) => {
	// express.static('dist');
// });

app.use(express.static('dist'));

httpServer.listen(port, () => {
	console.log(`Server is running on ${port}`);
});

export const io = new Server(httpServer);

const lobby = new Lobby();