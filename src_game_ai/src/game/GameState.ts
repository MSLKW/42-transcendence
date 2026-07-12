import { CardTransmit, CardHandTransmit, PentupleType } from "../Types";
import { cardHandComp } from "../utils/cardHandComp";
import { initSingles } from "./initSingles";
import { initMatchingHands } from "./initMatchingHands";
import { initFullHouses } from "./initFullHouses";
import { initStraights } from "./initStraights";
import { initFlushes } from "./initFlushes";

type Card = CardTransmit;
type CardHand = CardHandTransmit;

export type HandTypeKey = "single" | "double" | "triple" | "straight" | "flush" |
						"full_house" | "four_of_a_kind" | "straight_flush";

export class GameState
{
	playerCards:		Card[];
	opponentCards:		Record<string, Card[]>;
	possibleCardHands = {} as Record<HandTypeKey, CardHand[]>;

	moveHistory:	CardHand[];
	maxHistory:		number = 20;

	constructor()
	{
		this.playerCards = [];
		this.opponentCards = {};
		this.possibleCardHands["single"] = [];
		this.possibleCardHands["double"] = [];
		this.possibleCardHands["triple"] = [];
		this.possibleCardHands["straight"] = [];
		this.possibleCardHands["flush"] = [];
		this.possibleCardHands["full_house"] = [];
		this.possibleCardHands["four_of_a_kind"] = [];
		this.possibleCardHands["straight_flush"] = [];
		this.moveHistory = [];
	}

	clearCards(): void
	{
		this.playerCards = [];
		this.opponentCards = {};
		this.possibleCardHands["single"] = [];
		this.possibleCardHands["double"] = [];
		this.possibleCardHands["triple"] = [];
		this.possibleCardHands["straight"] = [];
		this.possibleCardHands["flush"] = [];
		this.possibleCardHands["full_house"] = [];
		this.possibleCardHands["four_of_a_kind"] = [];
		this.possibleCardHands["straight_flush"] = [];
		this.moveHistory = [];
	}

	initPlayerCards(cards: Array<Card>): void
	{
		this.clearCards();

		this.playerCards = cards;
		this.playerCards.sort(this.rankComp);

		initSingles(this);
		initMatchingHands(this); //doubles, triples, four of a kinds
		initFullHouses(this);
		initStraights(this); //straights and straigh flushes

		this.playerCards.sort(this.suitComp);
		initFlushes(this); //ignores straight flushes
		
		for (const key in this.possibleCardHands)
		{
			const handTypeKey = key as HandTypeKey;
			this.possibleCardHands[handTypeKey].sort(cardHandComp);
		}
	}

	setLastMove(cardHand: CardHand)
	{
		this.moveHistory.push(this.normalizeCardHand(cardHand));
		if (this.moveHistory.length > this.maxHistory)
			this.moveHistory.splice(0, 1);
	}

	removeCards(cardHand: CardHand)
	{
		for (const key in this.possibleCardHands)
		{
			const handTypeKey = key as HandTypeKey;
			for (let i = 0; i < this.possibleCardHands[handTypeKey].length; i++)
			{
				if (cardHand.cards.some(card  => 
					this.possibleCardHands[handTypeKey][i].cards.includes(card))
				)
				{
					this.possibleCardHands[handTypeKey].splice(i, 1);
					i--;
				}
			}
		}
	}

	private rankComp = (a: Card, b: Card) =>
	{
		if (a.rank == b.rank)
			return a.suit - b.suit;
		return a.rank - b.rank;
	}

	private suitComp = (a: Card, b: Card) =>
	{
		if (a.suit == b.suit)
			return a.rank - b.rank;
		return a.suit - b.suit;
	}

	private normalizeCardHand(cardHand: CardHand): CardHand
	{
		cardHand.cards.sort(this.rankComp);
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
}
