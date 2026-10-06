import { Game } from './Game.ts';

export let gameInstance: Game | null = null;

export function joinGameLobby(gameSessionId: string, playerId: string) {
	if (gameInstance !== null) {
		gameInstance.disconnect();
		gameInstance = null;
	}
	gameInstance = new Game(gameSessionId, playerId);
}
