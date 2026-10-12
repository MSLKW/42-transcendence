import { AAIController } from "./AAIController.js";
import { CardHandTransmit } from "@big2/game-types";

type CardHand = CardHandTransmit;

export class AggressiveController extends AAIController
{
	protected override think(options: CardHand[]): CardHand
	{
		return (options[options.length - 1]);
	}
}
