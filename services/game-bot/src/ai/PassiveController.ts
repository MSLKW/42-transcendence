import { AAIController } from "./AAIController.js";
import { CardHandTransmit } from "@big2/game-types";

type CardHand = CardHandTransmit;

export class PassiveController extends AAIController
{
	protected override think(options: CardHand[]): CardHand
	{
		return (options[0]);
	}
}
