import { CardTransmit, CardHandTransmit, HandType, CardRank, CardSuit } from "@big2/game-types";
import { GameState, HandTypeKey } from "../game/GameState.js";
import { upperBound } from "../utils/upperBound.js";
import { cardHandComp } from "../utils/cardHandComp.js";

type Card = CardTransmit;
type CardHand = CardHandTransmit;

export abstract class AAIController
{
	public decide(botId: string, state: GameState, skippable: boolean): CardHand | null
	{
		const lowestCard = state.possibleCardHands["single"][0].cards[0];
		if (lowestCard.rank == 0 && lowestCard.suit == 0)
			return (this.playLead(state, true));
		else if (skippable == false)
			return (this.playLead(state, false));
		else
			return (this.playFollow(botId, state));
	}

	protected abstract think(options: CardHand[]): CardHand;

	private playLead(state: GameState, isFirstHand: boolean): CardHand
	{
		const allCardHands: CardHand[] = [];
		
		for (const key in state.possibleCardHands)
		{
			const handTypeKey = key as HandTypeKey;
			allCardHands.push(...state.possibleCardHands[handTypeKey]);
		}
		if (!isFirstHand)
			return (this.think(allCardHands));
		for (let i = allCardHands.length - 1; i >= 0; i--)
		{
			if (!allCardHands[i].cards.some(card => card.rank == 0 && card.suit == 0))
				allCardHands.splice(i, 1);
		}
		return (this.think(allCardHands));
	}

	private playFollow(botId: string, state: GameState): CardHand | null
	{
		let cardHands: CardHand[] = [];

		switch (state.lastCardHand!.handType)
		{
			case HandType.Single:
				cardHands = state.possibleCardHands["single"];
				break;
			case HandType.Double:
				cardHands = state.possibleCardHands["double"];
				break ;
			case HandType.Triple:
				cardHands = state.possibleCardHands["triple"];
				break ;
			case HandType.Pentuple:
				cardHands = [
					...state.possibleCardHands["straight"],
					...state.possibleCardHands["flush"],
					...state.possibleCardHands["full_house"],
					...state.possibleCardHands["four_of_a_kind"],
					...state.possibleCardHands["straight_flush"]
				];
				break ;
		}
		const i = upperBound(
			cardHands,
			state.lastCardHand!,
			cardHandComp
		);
		if (i == cardHands.length)
			return null;
		const options: CardHand[] = cardHands.slice(i);
		return (this.think(options));
	}
}
