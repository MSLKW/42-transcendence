import { GameState } from "./GameState";
import { CardTransmit, CardHandTransmit, HandType, PentupleType } from "../Types";

type Card = CardTransmit;
type CardHand = CardHandTransmit;

export function initMatchingHands(state: GameState): void
{
	let i = 0;

	while (i < state.playerCards.length)
	{
		const one = state.playerCards[i];
		const two = state.playerCards[i + 1];
		const three = state.playerCards[i + 2];
		const four = state.playerCards[i + 3];

		if (four != undefined && one.rank == four.rank)
		{
			const quadHandTemp: CardHand = {
				cards: [one, two, three, four],
				handType: HandType.Pentuple,
				pentupleType: PentupleType.FourOfAKind,
				playerId: "placeholder"
			};
			createFourOfAKinds(state, quadHandTemp, i);
			state.possibleCardHands["triple"].push(createTriple(one, two, three));
			state.possibleCardHands["triple"].push(createTriple(one, two, four));
			state.possibleCardHands["triple"].push(createTriple(one, three, four));
			state.possibleCardHands["triple"].push(createTriple(two, three, four));
			state.possibleCardHands["double"].push(createDouble(one, two));
			state.possibleCardHands["double"].push(createDouble(one, three));
			state.possibleCardHands["double"].push(createDouble(one, four));
			state.possibleCardHands["double"].push(createDouble(two, three));
			state.possibleCardHands["double"].push(createDouble(two, four));
			state.possibleCardHands["double"].push(createDouble(three, four));
			i += 4;
		}
		else if (three != undefined && one.rank == three.rank)
		{
			state.possibleCardHands["triple"].push(createTriple(one, two, three));
			state.possibleCardHands["double"].push(createDouble(one, two));
			state.possibleCardHands["double"].push(createDouble(one, three));
			state.possibleCardHands["double"].push(createDouble(two, three));
			i += 3;
		}
		else if (two != undefined && one.rank == two.rank)
		{
			state.possibleCardHands["double"].push(createDouble(one, two));
			i += 2;
		}
		else
			i += 1;
	}
}

function createDouble(a: Card, b: Card): CardHand
{
	const cardHand: CardHand = {
		cards: [a, b],
		handType: HandType.Double,
		pentupleType: PentupleType.None,
		playerId: "placeholder"
	};
	return (cardHand);
}

function createTriple(a: Card, b: Card, c: Card): CardHand
{
	const cardHand: CardHand = {
		cards: [a, b, c],
		handType: HandType.Triple,
		pentupleType: PentupleType.None,
		playerId: "placeholder"
	};
	return (cardHand);
}

function createFourOfAKinds(state: GameState, quadHandTemp: CardHand, index: number)
{
	for (let i = 0; i < state.playerCards.length; i++)
	{
		if (i >= index && i < index + 4)
			continue ;
		const fourOfAKindHand: CardHand = {
			...quadHandTemp,
			cards: [state.playerCards[i], ...quadHandTemp.cards]
		};
		state.possibleCardHands["four_of_a_kind"].push(fourOfAKindHand);
	}
}
