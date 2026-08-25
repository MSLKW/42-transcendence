import { Socket } from "socket.io-client";
import { useProfileStore } from "../../../store/ProfileStore";
import { joinGameLobby } from "../../game/src/main";

export function gameSessionStartHandler(socket: Socket) {
	socket.on("game_session_start", (payload: {gameId: string}) => {
		const clientUuid = useProfileStore.getState().clientUuid;
		if (clientUuid === null) {
			console.log("[partySocket] 'game_session_start' clientUuid is missing");
			return ;
		}
		console.log("[partySocket] 'game_session_start' gameId:", payload.gameId);
		joinGameLobby(payload.gameId, clientUuid);
	});
}