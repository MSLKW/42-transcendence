import { CardTransmit, CardHandTransmit, HandType, PentupleType } from "../Types";

type Card = CardTransmit;
type CardHand = CardHandTransmit;

export function cardHandComp(a: CardHand, b: CardHand): number
{
	if (a.handType != b.handType)
		return (a.handType - b.handType);
	if (a.pentupleType != b.pentupleType)
		return (a.pentupleType - b.pentupleType);
	if (a.pentupleType == PentupleType.Flush)
	{
		if (a.cards[0].suit == b.cards[0].suit)
			return (a.cards[a.cards.length - 1].rank - b.cards[b.cards.length - 1].rank);
		return (a.cards[a.cards.length - 1].suit - b.cards[b.cards.length - 1].suit);
	}
	if (a.cards[a.cards.length - 1].rank == b.cards[b.cards.length - 1].rank)
		return (a.cards[a.cards.length - 1].suit - b.cards[b.cards.length - 1].suit);
	return (a.cards[a.cards.length - 1].rank - b.cards[b.cards.length - 1].rank);
}
