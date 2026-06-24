import { GameStateData } from "../types";

export class GameState {
	private data: GameStateData | null = null;

	update(payload: GameStateData): void {
		this.data = payload;
	}

	get current(): GameStateData | null {
		return this.data;
	}
}
