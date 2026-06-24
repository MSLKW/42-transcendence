import { GameState } from "../game/GameState";
import { Action } from "../types";

export class AIController {
	constructor(private state: GameState) {}

	decide(): Action {
		const current = this.state.current;
		// placeholder logic — replace with real strategy
		return { type: "noop" };
	}
}
