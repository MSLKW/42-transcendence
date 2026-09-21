import { Game } from './Game.ts';
import { useSceneStore } from '../../../store/SceneStore.ts';

export let gameInstance: Game | null = null;

export function joinGameLobby(gameSessionId: string, playerId: string) {
	console.log(`gameSessionId: ${gameSessionId} | playerId: ${playerId}`);
	if (gameInstance !== null) {
		console.log("[Game] Game Session is already ongoing");
		// return ;
	}
	gameInstance = new Game(gameSessionId, playerId);
	useSceneStore.getState().setCurrentScene("Lobby");
}
