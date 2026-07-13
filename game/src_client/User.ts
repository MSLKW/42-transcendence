// import { io } from 'socket.io-client'
// import { Player } from './Player.ts';
// import { Opponent } from './Opponent.ts';
// import { GameStatus } from './GameStatus.ts';

// export class User {
// 	private socket: Socket;

// 	constructor() {
// 		const socket = io('http://localhost:3000', {
// 			auth: {
// 				token: authId
// 			}
// 		})

// 		socket.on('connect', () => {
// 			console.log(`Socket connected`);
// 		});
// 		socket.on('graceful_disconnect', () => {
// 			socket.disconnect();
// 		});
// 		socket.on('disconnect', () => {
// 			console.log('Socket disconnected')
// 		});

// 		const startGameButton = document.getElementById('start-game-button') as HTMLButtonElement;

// 		socket.on('game_start_request', (status: statusTransmit) => {
// 			if (status.success === true) {
// 				this.startGameButton.disabled = true;
// 			}
// 			console.log(`Start Game: ${status.success}`);
// 		});

// 		startGameButton.addEventListener('click', () => {
// 			const gameStartRequest: GameStartRequest = {
// 				playerId: this.playerId
// 			}
// 			this.socket.emit('game_start_request', gameStartRequest);
// 		});

// 		socket.on('player_join', (playerJoin: PlayerSeatOrderTransmit) => { 
// 			console.log(playerJoin);
// 			if (playerJoin.playerId === playerId) {
// 				const player = new Player(socket, playerId, cardHeap);
// 				const [pos, rot] = tablePosition(playerJoin.seatOrder[playerId], true);
// 				player.cardManager.updateManager(pos, rot);
// 				const seatOrder: Record<string, number> = playerJoin.seatOrder;
// 				Object.keys(seatOrder).forEach((id) => {
// 					if (id !== playerId ) {
// 						const opponent = new Opponent(socket, id, cardHeap);
// 						const [pos, rot] = tablePosition(playerJoin.seatOrder[id], false);
// 						opponent.cardManager.updateManager(pos, rot);
// 					}
// 				})
// 			}
// 			else {
// 				const opponent = new Opponent(socket, playerJoin.playerId, cardHeap);
// 				const [pos, rot] = tablePosition(playerJoin.seatOrder[playerJoin.playerId], false);
// 				opponent.cardManager.updateManager(pos, rot);
// 			}
// 		});
// 	}

// }