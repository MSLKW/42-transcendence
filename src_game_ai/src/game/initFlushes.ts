import { GameState } from "./GameState";
import { CardTransmit, CardHandTransmit, HandType, PentupleType } from "../Types";

type Card = CardTransmit;
type CardHand = CardHandTransmit;

export function initFlushes(state: GameState): void
{
	const temp: Card[] = [];
	recursiveSearch(state, temp, 0);
}

function recursiveSearch(state: GameState, temp: Card[], i: number): void
{
	if (temp.length == 5)
	{
		addFlush(state, temp);
		return ;
	}
	while (i < state.playerCards.length - 4 + temp.length)
	{
		if (temp.length == 0 || state.playerCards[i].suite == temp[0].suite)
		{
			temp.push(state.playerCards[i]);
			recursiveSearch(state, temp, i + 1);
			temp.pop();
		}
		i++;
	}
}

function addFlush(state: GameState, temp: Card[]): void
{
	for (let i = 0; i < temp.length; i++)
	{
		if (i == temp.length - 1)
			return ;
		if (temp[i].rank + 1 != temp[i + 1].rank)
			break ;
	}
	
	const flush: CardHand = {
			cards: [...temp],
			handType: HandType.Pentuple,
			pentupleType: PentupleType.Flush,
			playerId: "placeholder"
	};
	state.possibleCardHands["flush"].push(flush);
}
