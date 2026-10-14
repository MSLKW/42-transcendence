import { CardTransmit, CardHandTransmit, HandType } from "@big2/game-types";
import { rankComp, suitComp, cardHandComp } from "../utils/cardHandComp.js";
import { normalizePlayerSeats } from "./normalizePlayerSeats.js";

import { initSingles } from "./initSingles.js";
import { initMatchingHands } from "./initMatchingHands.js";
import { initFullHouses } from "./initFullHouses.js";
import { initStraights } from "./initStraights.js";
import { initFlushes } from "./initFlushes.js";

import { normalizeCardHand } from "./normalizeCardHand.js";

type Card = CardTransmit;
type CardHand = CardHandTransmit;

export type HandTypeKey = "single" | "double" | "triple" | "straight" | "flush" |
						"full_house" | "four_of_a_kind" | "straight_flush";

export class GameState
{
	botId:				string;
	ownCards:			Card[];
	playerCount:		number = 0;
	playerSeats:		Record<string, number>;	
	opponentCards		= {} as Record<string, Card[]>;
	possibleCardHands	= {} as Record<string, CardHand[]>;

	moveHistory:		CardHand[];
	maxHistory:			number = 20;
	lastCardHand:		CardHand;
	cardHandsPlayed:	number = 0;
	turnNumber:			number = 0;
	
	currentPlayer:		string = '';
	turnSkipped:		boolean = false;

	leader:				number = -1;
	
	private originalCardsEncoded:	number[];

	constructor(botId: string, players: Record<string, number>, ownCards: Array<Card>)
	{
		this.botId = botId;
		this.playerSeats = players;
		this.ownCards = [...ownCards];
		this.originalCardsEncoded = this.encodePlayerCards(this.ownCards);
		
		for (const key in players)
		{
			if (key != botId)
				this.opponentCards[key] = [];
		}

		this.possibleCardHands["single"] = [];
		this.possibleCardHands["double"] = [];
		this.possibleCardHands["triple"] = [];
		this.possibleCardHands["straight"] = [];
		this.possibleCardHands["flush"] = [];
		this.possibleCardHands["full_house"] = [];
		this.possibleCardHands["four_of_a_kind"] = [];
		this.possibleCardHands["straight_flush"] = [];
		
		this.moveHistory = [];
		this.lastCardHand = { cards: [], handType: 0, pentupleType: 0, playerId: ""	};

		this.playerCount = Object.keys(players).length;
		if (this.playerCount == 0 || ownCards.length == 0)
			return ;

		normalizePlayerSeats(this.playerSeats, this.botId);

		this.ownCards.sort(rankComp);
		initSingles(this);
		initMatchingHands(this); //doubles, triples, four of a kinds
		initFullHouses(this);
		initStraights(this); //straights and straight flushes

		this.ownCards.sort(suitComp);
		initFlushes(this); //ignores straight flushes
		
		for (const key in this.possibleCardHands)
			this.possibleCardHands[key].sort(cardHandComp);
	}

	setLastCardHand(cardHand: CardHand)
	{
		this.lastCardHand = cardHand;
		this.recordHistory(cardHand);

		if (cardHand.playerId != this.botId)
			this.opponentCards[cardHand.playerId].push(...cardHand.cards);
		this.cardHandsPlayed++;
	}

	recordSkippedMove(playerId: string)
	{
		const skippedHand: CardHand = {
			cards: [],
			handType: 0,
			pentupleType: 0,
			playerId: playerId
		};
		this.recordHistory(skippedHand);
	}

	removeCards(cardHand: CardHand)
	{
		for (let i = 0; i < this.ownCards.length; i++)
		{
			if (cardHand.cards.includes(this.ownCards[i]))
			{
				this.ownCards.splice(i, 1);
				i--;
			}

		}
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
	
	private recordHistory(cardHand: CardHand)
	{
		this.moveHistory.push(normalizeCardHand(cardHand));
		if (this.moveHistory.length > this.maxHistory)
			this.moveHistory.splice(0, 1);
	}

	encode(): number[]
	{
		const encodedState: number[] = [
			...this.encodeCards(),
			...this.encodeCardCount(),
			...this.encodeCardHand(this.lastCardHand),
			...this.encodeHistory(),
			this.turnNumber,
		];
		return (encodedState)
	}

	private encodeCards(): number[]
	{
		const playerCardsEncoded: number[][] = [];

		playerCardsEncoded[0] = this.encodePlayerCards(this.ownCards); 
		let i = 1;
		for (const key in this.opponentCards)
		{
			if (key != this.botId)
				playerCardsEncoded[this.playerSeats[key]] = this.encodePlayerCards(this.opponentCards[key]);
			i++;
		}
		while (i < 4)
		{
			playerCardsEncoded[i] = new Array<number>(52).fill(0);
			i++;
		}
		
		const unseenCards = new Array<number>(52)
		for (let i = 0; i < 52; i++)
		{
			unseenCards[i] =
				this.originalCardsEncoded[i]
				|| playerCardsEncoded[1][i]
				|| playerCardsEncoded[2][i]
				|| playerCardsEncoded[3][i]
				? 0 : 1;
		}

		const encodedCards: number[] = [
			...playerCardsEncoded[0],
			...playerCardsEncoded[1],
			...playerCardsEncoded[2],
			...playerCardsEncoded[3],
			...unseenCards
		];
		return (encodedCards);
	}

	private encodeCardCount(): number[]
	{
		const encodedCardCount = new Array<number>(4).fill(0);

		encodedCardCount[0] = this.ownCards.length / 52;
		for (const key in this.opponentCards)
				encodedCardCount[this.playerSeats[key]] = (Math.floor(52 / this.playerCount) - this.opponentCards[key].length) / 52;
		return (encodedCardCount);
	}

	private encodeHistory(): number[]
	{
		const encodedHistory: number[] = [];

		for (let i = this.moveHistory.length - 1; i >= 0; i--)
			encodedHistory.push(...this.encodeCardHand(this.moveHistory[i]))
		encodedHistory.push(...Array<number>((20 * 23) - encodedHistory.length).fill(0));
		return (encodedHistory);
	}

	private encodePlayerCards(cards: Card[]): number[]
	{
		const encodedCards = new Array<number>(52).fill(0);

		for (const card of cards)
		{
			const i = card.suit * 13 + card.rank;
			encodedCards[i] = 1;
		}
		return (encodedCards);
	}

	private encodeCardHand(cardHand: CardHand): number[]
	{
		const player = new Array<number>(4).fill(0);
		const handType = new Array<number>(9).fill(0);
		const cards = new Array<number>(10).fill(0);

		if (cardHand.playerId == "")
			return [...player, ...handType, ...cards];
		player[this.playerSeats[cardHand.playerId]] = 1;
		let handTypeIndex = cardHand.handType;
		if (cardHand.handType == HandType.Pentuple)
			handTypeIndex += cardHand.pentupleType - 1;
		handType[handTypeIndex] = 1;
		for (let i = 0; i < cardHand.cards.length; i++)
		{
			cards[(2 * i)] = (cardHand.cards[i].rank + 1) / 13;
			cards[(2 * i) + 1] = (cardHand.cards[i].suit + 1) / 4;
		}
		return [...player, ...handType, ...cards];
	}
}
