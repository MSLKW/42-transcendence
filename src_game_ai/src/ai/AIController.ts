import { GameState } from "../game/GameState";
import { CardRank, CardSuite, CardTransmit, CardHandTransmit } from "../Types";

type Card = CardTransmit;
type CardHand = CardHandTransmit;

export class AIController {
	constructor(private state: GameState) {}

}
