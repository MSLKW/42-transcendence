import { Socket } from "socket.io-client";

export function gameSessionStartHandler(socket: Socket) {
	socket.on("game_session_start", (payload: {gameId: string}) => {
		console.log("[partySocket] 'game_session_start' gameId:", payload.gameId);
	});
}