import { CardTransmit, CardHandTransmit, PentupleType } from "../Types";
import { rankComp, suitComp, cardHandComp } from "../utils/cardHandComp";
import { normalizePlayerSeats } from "./normalizePlayerSeats"

import { initSingles } from "./initSingles";
import { initMatchingHands } from "./initMatchingHands";
import { initFullHouses } from "./initFullHouses";
import { initStraights } from "./initStraights";
import { initFlushes } from "./initFlushes";

import { normalizeCardHand } from "./normalizeCardHand";

type Card = CardTransmit;
type CardHand = CardHandTransmit;

export type HandTypeKey = "single" | "double" | "triple" | "straight" | "flush" |
						"full_house" | "four_of_a_kind" | "straight_flush";

export class GameState
{
	botId:				string;
	ownCards:			Card[];
	playerSeats:		Record<string, number>;	
	opponentCards		= {} as Record<string, Card[]>;
	possibleCardHands	= {} as Record<HandTypeKey, CardHand[]>;

	moveHistory:		CardHand[];
	maxHistory:			number = 20;
	lastCardHand:		CardHand;
	cardHandsPlayed:	number = 0;
	turnNumber:			number = 0;
	
	currentPlayer:		string = '';
	turnSkipped:		boolean = false;

	leader:				number = -1;

	constructor(botId: string, players: Record<string, number>, ownCards: Array<Card>)
	{
		this.botId = botId;
		this.playerSeats = players;
		this.ownCards = ownCards;
		
		for (const key in players)
			this.opponentCards[key] = [];

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
	
		if (Object.keys(players).length == 0 || ownCards.length == 0)
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
		{
			const handTypeKey = key as HandTypeKey;
			this.possibleCardHands[handTypeKey].sort(cardHandComp);
		}
	}

	setLastCardHand(cardHand: CardHand)
	{
		this.lastCardHand = cardHand;
		this.recordHistory(cardHand);

		if (cardHand.playerId != this.botId)
			this.opponentCards[cardHand.playerId].push(...cardHand.cards);
		this.turnSkipped = false;
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
}
