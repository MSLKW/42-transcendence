import { rankComp } from "../utils/cardHandComp.js";
import { CardHandTransmit, PentupleType } from "@big2/game-types";

type CardHand = CardHandTransmit

export function normalizeCardHand(cardHand: CardHand): CardHand
{
	cardHand.cards.sort(rankComp);
	if (cardHand.pentupleType == PentupleType.FullHouse
		&& cardHand.cards[0].rank == cardHand.cards[2].rank)
	{
		cardHand.cards = [
			...cardHand.cards.slice(3, 5),
			...cardHand.cards.slice(0, 3)
		];
	}
	if (cardHand.pentupleType == PentupleType.FourOfAKind
		&& cardHand.cards[0].rank == cardHand.cards[1].rank)
	{
		cardHand.cards = [cardHand.cards[4], ...cardHand.cards.slice(0, 4)];
	}
	return cardHand;
}

