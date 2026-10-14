import { GameState } from "./GameState.js";
import { CardTransmit, CardHandTransmit, HandType, PentupleType } from "@big2/game-types";

type Card = CardTransmit;
type CardHand = CardHandTransmit;

export function initStraights(state: GameState): void
{
	const temp: Card[] = [];
	recursiveSearch(state, temp, 0);
}

function recursiveSearch(state: GameState, temp: Card[], i: number): void
{
	if (temp.length == 5)
	{
		addStraight(state, temp);
		return ;
	}
	while (i < state.ownCards.length - 4 + temp.length)
	{
		if (temp.length == 0 || state.ownCards[i].rank == temp[temp.length - 1].rank + 1)
		{
			temp.push(state.ownCards[i]);
			recursiveSearch(state, temp, i + 1);
			temp.pop();
		}
		i++;
	}
}

function addStraight(state: GameState, temp: Card[]): void
{
	const straight: CardHand = {
			cards: [...temp],
			handType: HandType.Pentuple,
			pentupleType: PentupleType.Straight,
			playerId: "placeholder"
	};
	if (temp.every(card => card.suit == temp[0].suit))
	{
		straight.pentupleType = PentupleType.StraightFlush;
		state.possibleCardHands["straight_flush"].push(straight);
	}
	else
		state.possibleCardHands["straight"].push(straight);
}
