import { GameState, HandTypeKey } from "../game/GameState";
import { CardTransmit, CardHandTransmit, HandType, PentupleType } from "../Types";
import { upperBound } from "../utils/upperBound";
import { cardHandComp } from "../utils/cardHandComp";
import { logger } from "../utils/logger";

type Card = CardTransmit;
type CardHand = CardHandTransmit;

export class AIController {
	constructor() {}

	decide(botId: string, state: GameState): CardHand | null
	{
		logger.info(botId, "last move:", state.lastMove);
		if (state.lastMove.cards.length == 0)
			return (this.playLead(state, true));
		else if (state.lastMove.playerId == botId)
			return (this.playLead(state, false));
		else
			return (this.playFollow(state));
	}

	private playLead(state: GameState, isFirstHand: boolean): CardHand
	{
		const allCardHands: CardHand[] = [];
		
		for (const key in state.possibleCardHands)
		{
			const handTypeKey = key as HandTypeKey;
			allCardHands.push(...state.possibleCardHands[handTypeKey]);
		}
		if (!isFirstHand)
			return allCardHands[Math.floor(Math.random() * allCardHands.length)];
		for (let i = allCardHands.length - 1; i >= 0; i--)
		{
			if (!allCardHands[i].cards.some(card => card.rank == 0 && card.suit == 0))
				allCardHands.splice(i, 1);
		}
		return allCardHands[Math.floor(Math.random() * allCardHands.length)];
	}

	private playFollow(state: GameState): CardHand | null
	{
		let cardHands: CardHand[] = [];

		switch (state.lastMove.handType)
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
			state.lastMove,
			cardHandComp
		);
		if (i == cardHands.length)
			return null;
		const options: CardHand[] = cardHands.slice(i);
		return (options[Math.floor(Math.random() * options.length)]);
	}
}
