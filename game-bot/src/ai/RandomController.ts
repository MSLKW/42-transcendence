import { AAIController } from "./AAIController";
import { CardHandTransmit } from "../Types";

type CardHand = CardHandTransmit;

export class RandomController extends AAIController
{
	protected override think(options: CardHand[]): CardHand
	{
		return (options[Math.floor(Math.random() * options.length)]);
	}
}
