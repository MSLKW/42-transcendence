import { GameState } from "./GameState";
import { CardTransmit, CardHandTransmit, HandType, PentupleType } from "../Types";

type Card = CardTransmit;
type CardHand = CardHandTransmit;

export function initFullHouses(state: GameState): void
{
	state.possibleCardHands["triple"].forEach((triple: CardHand) =>
	{
		state.possibleCardHands["double"].forEach((double: CardHand) =>
		{
			if (double.cards[0].rank != triple.cards[0].rank)
			{
				const fullHouse: CardHand = {
					cards: [...double.cards, ...triple.cards],
					handType: HandType.Pentuple,
					pentupleType: PentupleType.FullHouse,
					playerId: "placeholder"
				};
				state.possibleCardHands["full_house"].push(fullHouse);
			}
		});
	});
}
