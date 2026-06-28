import { CardTransmit, CardHandTransmit, HandType, PentupleType } from "../Types";
import { initMatchingHands } from "./initMatchingHands";
import { initFullHouses } from "./initFullHouses";
import { initStraights } from "./initStraights";
import { initFlushes } from "./initFlushes";

type Card = CardTransmit;
type CardHand = CardHandTransmit;

export class GameState
{
	playerCards:		Card[];
	opponentCards:		Record<string, Card[]>;
	possibleCardHands = {} as Record<string, CardHand[]>;

	constructor()
	{
		this.playerCards = [];
		this.opponentCards = {};
		this.possibleCardHands["double"] = [];
		this.possibleCardHands["triple"] = [];
		this.possibleCardHands["straight"] = [];
		this.possibleCardHands["flush"] = [];
		this.possibleCardHands["full_house"] = [];
		this.possibleCardHands["four_of_a_kind"] = [];
		this.possibleCardHands["straight_flush"] = [];
	}

	initPlayerCards(cards: Array<Card>): void
	{
		this.playerCards = cards;
		this.playerCards.sort(this.rankComp);

		initMatchingHands(this); //doubles, triples, four of a kinds
		initFullHouses(this);
		initStraights(this); //straights and straigh flushes

		this.playerCards.sort(this.suitComp);
		initFlushes(this); //ignores straight flushes
	}

	private rankComp = (a: Card, b: Card) =>
	{
		if (a.rank == b.rank)
			return a.suite - b.suite;
		return a.rank - b.rank;
	}

	private suitComp = (a: Card, b: Card) =>
	{
		if (a.suite == b.suite)
			return a.rank - b.rank;
		return a.suite - b.suite;
	}
}
