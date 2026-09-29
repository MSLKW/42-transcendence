import { AAIController } from "./AAIController";
import { CardHandTransmit } from "../Types";

type CardHand = CardHandTransmit;

export class PassiveController extends AAIController
{
	protected override think(options: CardHand[]): CardHand
	{
		return (options[0]);
	}
}
