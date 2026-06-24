export interface GameStateData {
	// shape of whatever the server sends in "gameState"
	players: Record<string, unknown>;
	// ...fill in as your protocol solidifies
}

export interface Action {
	type: string;
	payload?: unknown;
}
