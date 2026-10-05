import { Game } from './Game.ts';
import { useSceneStore } from '../../../store/SceneStore.ts';
import { useGameStore } from '../../../store/GameStore.ts';

export let gameInstance: Game | null = null;

export function joinGameLobby(gameSessionId: string, playerId: string) {
	if (gameInstance !== null) {
		if (useGameStore.getState().gameVerboseMode)
			console.log("[Game] Game Session is already ongoing");
		// return ;
	}
	gameInstance = new Game(gameSessionId, playerId);
	useSceneStore.getState().setCurrentScene("Lobby");
}
