import { AAIController } from "./AAIController.js";
import { CardHandTransmit as CardHand } from "@big2/game-types";

export class PassiveRandomController extends AAIController
{
	protected override think(options: CardHand[]): CardHand
	{
		if (Math.random() > 0.1)
			return (options[Math.floor(Math.random() * options.length / 2)]);
		return (options[Math.floor((Math.random() * options.length / 2) + (options.length / 2))]);
	}
}
