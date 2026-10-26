import {
	CardTransmit as Card,
	CardHandTransmit as CardHand,
	HandType,
	CardRank, CardSuit
} from "@big2/game-types";
import { GameState, HandTypeKey } from "../game/GameState.js";
import { upperBound } from "../utils/upperBound.js";
import { cardHandComp } from "../utils/cardHandComp.js";

export abstract class AAIController
{
	public decide(botId: string, state: GameState, skippable: boolean, lowestCardRequired?: Card): CardHand | null
	{
		if (skippable == false)
			return (this.playLead(state, lowestCardRequired));
		else
			return (this.playFollow(botId, state));
	}

	protected abstract think(options: CardHand[]): CardHand;

	private playLead(state: GameState, lowestCardRequired?: Card): CardHand
	{
		const allCardHands: CardHand[] = [];
		
		for (const key in state.possibleCardHands)
		{
			const handTypeKey = key as HandTypeKey;
			allCardHands.push(...state.possibleCardHands[handTypeKey]);
		}
		if (lowestCardRequired == undefined)
			return (this.think(allCardHands));
		for (let i = allCardHands.length - 1; i >= 0; i--)
		{
			if (!allCardHands[i].cards.some(card => card.rank == lowestCardRequired.rank && card.suit == lowestCardRequired.suit))
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
