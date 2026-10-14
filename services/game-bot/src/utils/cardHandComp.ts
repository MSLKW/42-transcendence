import { CardTransmit, CardHandTransmit, HandType, PentupleType } from "@big2/game-types";

type Card = CardTransmit;
type CardHand = CardHandTransmit;

export function cardHandComp(a: CardHand, b: CardHand): number
{
	if (a.handType != b.handType)
		return (a.handType - b.handType);
	if (a.pentupleType != b.pentupleType)
		return (a.pentupleType - b.pentupleType);
	if (a.cards[a.cards.length - 1].rank == b.cards[b.cards.length - 1].rank)
		return (a.cards[a.cards.length - 1].suit - b.cards[b.cards.length - 1].suit);
	return (a.cards[a.cards.length - 1].rank - b.cards[b.cards.length - 1].rank);
}

export function rankComp(a: Card, b: Card): number
{
	if (a.rank == b.rank)
		return (a.suit - b.suit);
	return (a.rank - b.rank);
}

export function suitComp(a: Card, b: Card): number
{
	if (a.suit == b.suit)
		return (a.rank - b.rank);
	return (a.suit - b.suit);
}
