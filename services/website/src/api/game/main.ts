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