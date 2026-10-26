import { useGameStore } from '../../store/GameStore';
import { Game } from './Game';

export let gameInstance: Game | null = null;

export function joinGameLobby(gameSessionId: string, playerId: string) {
	if (gameInstance !== null) {
		clearGameInstance();
	}
	gameInstance = new Game(gameSessionId, playerId);
}

export function clearGameInstance() {
	gameInstance.disconnect();
	gameInstance = null;
}

export function gameLog(...args: unknown[]) {
	if (useGameStore.getState().gameVerboseMode === true) {
		console.log(...args);
	}
}