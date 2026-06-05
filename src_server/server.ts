import express from 'express';
import type { Request, Response } from 'express';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import z from 'zod';

import { CardHandTransmit, CardRank, CardSuite, HandType, PentupleType } from '../src_shared/Types.js'

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

const io = new Server(httpServer);

io.on("connection", (socket) => {
	console.log(`Socket has connected: ${socket.id}`);

	socket.on('msg', (msg) => {
		// const cardhand = JSON.parse(msg) as CardHandSerialized;
		const cardHand = JSON.parse(msg) as CardHandTransmit;
		console.log(`Handtype: ${HandType[cardHand.handType]}`);
		console.log(`msg received: ${msg}`);
	});

	socket.on("playCardHand", (body) => {
		const cardHandTransmit = JSON.parse(body) as CardHandTransmit;
		socket.emit('playCardHand', 'success');
	})
});