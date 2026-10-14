import { GameState } from "./GameState";
import {
	CardTransmit as Card,
	CardHandTransmit as CardHand,
	HandType,
	PentupleType
} from "@big2/game-types";

export function initSingles(state: GameState): void
{
	state.ownCards.forEach((card: Card) =>
	{
		const single: CardHand = {
			cards: [card],
			handType: HandType.Single,
			pentupleType: PentupleType.None,
			playerId: state.botId
		};
		state.possibleCardHands["single"].push(single);
	});
}
