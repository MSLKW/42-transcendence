import { AAIController } from "./AAIController.js";
import { CardHandTransmit } from "@big2/game-types";

type CardHand = CardHandTransmit;

export class RandomController extends AAIController
{
	protected override think(options: CardHand[]): CardHand
	{
		return (options[Math.floor(Math.random() * options.length)]);
	}
}
