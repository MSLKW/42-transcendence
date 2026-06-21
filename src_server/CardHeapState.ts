import { CardHandTransmit, HandType, PentupleType } from "../src_shared/Types.js";
import { PlayerState } from "./PlayerState.js";
import { io } from "./server.js";

export class CardHeapState {
	private cardHands: Array<CardHandTransmit>;
	private currentHandType: HandType = HandType.None;

	constructor() {
		this.cardHands = [];
	}

	public receiveCardHand(cardHand: CardHandTransmit) {
		this.cardHands.push(cardHand);
		this.currentHandType = cardHand.handType;
		io.to("game").emit("opponent_play_card_hand", JSON.stringify(cardHand));
	}

	public isCardHandPlayable(other: CardHandTransmit): boolean {
		const topCardHand = this.cardHands.at(this.cardHands.length - 1);
		if (topCardHand === undefined) {
			return (true);
		}
		if (topCardHand.playerId === other.playerId) {
			return (true);
		}
		if (this.currentHandType !== HandType.None && other.handType !== this.currentHandType)
			return (false);
		// Comparing
		if (other.handType === HandType.Single || other.handType === HandType.Double || other.handType === HandType.Triple) {
			if (other.cards[0].rank > topCardHand.cards[0].rank)
				return (true);
			else if (other.cards[0].rank === topCardHand.cards[0].rank && other.cards[0].suite > topCardHand.cards[0].suite)
				return (true);
		}
		else if (other.handType === HandType.Pentuple) {
			if (other.pentupleType > topCardHand.pentupleType)
				return (true);
			if (other.pentupleType === PentupleType.Straight || other.pentupleType === PentupleType.StraightFlush) {
				if (other.cards[0].rank > topCardHand.cards[0].rank)
					return (true);
				else if (other.cards[0].rank === topCardHand.cards[0].rank && other.cards[0].suite > topCardHand.cards[0].suite)
					return (true);
			}
			else if (other.pentupleType === PentupleType.Flush) {
				if (other.cards[0].suite > topCardHand.cards[0].suite)
					return (true);
				else if (other.cards[0].suite === topCardHand.cards[0].suite && other.cards[0].rank > topCardHand.cards[0].rank)
					return (true);
			}
			else if (other.pentupleType === PentupleType.FullHouse || other.pentupleType === PentupleType.FourOfAKind) {
				if (other.cards[2].rank > topCardHand.cards[2].rank) {
					return (true);
				}
			}
		}
		return (false);
	}

}