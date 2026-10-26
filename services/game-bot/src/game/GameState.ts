import {
	CardTransmit as Card,
	CardHandTransmit as CardHand,
	GameStateTransmit,
	GameSettingsTransmit as GameSettings
} from "@big2/game-types";

import { rankComp, suitComp, cardHandComp } from "../utils/cardHandComp.js";

import { initSingles } from "./initSingles.js";
import { initMatchingHands } from "./initMatchingHands.js";
import { initFullHouses } from "./initFullHouses.js";
import { initStraights } from "./initStraights.js";
import { initFlushes } from "./initFlushes.js";


export type HandTypeKey = "single" | "double" | "triple" | "straight" | "flush" | "full_house" | "four_of_a_kind" | "straight_flush";

function createEmptyPossibleCardHands(): Record<HandTypeKey, CardHand[]>
{
	return {
		single:			[],
		double:			[],
		triple:			[],
		straight:		[],
		flush:			[],
		full_house:		[],
		four_of_a_kind:	[],
		straight_flush:	[]
	};
}

export class GameState
{
	readonly botId:			string = "";
	readonly playerSeats:	Record<string, number> = {};
	readonly gameSettings?:	GameSettings;
	ownCards:				Card[] = [];
	
	possibleCardHands:		Record<HandTypeKey, CardHand[]> = createEmptyPossibleCardHands();
	lastCardHand:			CardHand | null = null;


	constructor(botId: string | void, stateTransmit: GameStateTransmit | void)
	{
		if (botId == undefined || stateTransmit == undefined)
			return ;

		this.botId = botId;
		this.playerSeats = stateTransmit.playerSeatOrder;
		this.gameSettings = stateTransmit.gameSettings;
		this.ownCards = [...stateTransmit.playerCards];
		
		this.ownCards.sort(suitComp);
		initFlushes(this); //ignores straight flushes

		this.ownCards.sort(rankComp);
		initSingles(this);
		initMatchingHands(this); //doubles, triples, four of a kinds
		if (this.gameSettings.allow3OfAKind)
			this.possibleCardHands["triple"] = [];
		initFullHouses(this);
		initStraights(this); //straights and straight flushes
				
		for (const key in this.possibleCardHands)
			this.possibleCardHands[key as HandTypeKey].sort(cardHandComp);
	}

	setLastCardHand(cardHand: CardHand)
	{
		this.lastCardHand = cardHand;
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
}
