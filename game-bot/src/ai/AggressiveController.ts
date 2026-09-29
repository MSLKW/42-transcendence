import { AAIController } from "./AAIController";
import { CardHandTransmit } from "../Types";

type CardHand = CardHandTransmit;

export class AggressiveController extends AAIController
{
	protected override think(options: CardHand[]): CardHand
	{
		return (options[options.length - 1]);
	}
}
