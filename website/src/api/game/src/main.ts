import { Game } from './Game.ts';

export let gameInstance: Game | null = null;

export function joinGameLobby(gameSessionId: string, playerId: string) {
	if (gameInstance !== null) {
		gameInstance.resetGame();
		gameInstance = null;
	}
	gameInstance = new Game(gameSessionId, playerId);
}
