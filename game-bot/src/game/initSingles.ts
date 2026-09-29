import { GameState } from "./GameState";
import { CardTransmit, CardHandTransmit, HandType, PentupleType } from "../Types";

type Card = CardTransmit;
type CardHand = CardHandTransmit;

export function initSingles(state: GameState): void
{
	state.ownCards.forEach((card: Card) =>
	{
		const single: CardHand = {
			cards: [card],
			handType: HandType.Single,
			pentupleType: PentupleType.None,
			playerId: "placeholder"
		};
		state.possibleCardHands["single"].push(single);
	});
}
