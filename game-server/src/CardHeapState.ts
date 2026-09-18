import { CardHandTransmit, HandType, PentupleType } from '@big2/game-types';
import { PlayerState } from "./PlayerState.js";
import { CardHandState } from "./CardHandState.js";
import { io } from "./server.js";

export class CardHeapState {
	private cardHands: Array<CardHandState>;
	private	leadingPlayerId: string;
	public	requiresThreeDiamonds: boolean;

	constructor() {
		this.cardHands = [];
		this.leadingPlayerId = "";
		this.requiresThreeDiamonds = true;
	}

	public receiveCardHand(cardHand: CardHandState) {
		this.cardHands.push(cardHand);
		this.leadingPlayerId = cardHand.playerId;
		this.requiresThreeDiamonds = false;
	}

	public cardHandsAmount() {
		return (this.cardHands.length);
	}

	private getTopCardHand(): CardHandState | undefined {
		return (this.cardHands.at(this.cardHands.length - 1))
	}

	public isPlayerLeading(playerId: string): boolean {
		if (this.leadingPlayerId === "")
			return (true);
		return (this.leadingPlayerId === playerId);
	}

	public resetPlayerLeading() {
		this.leadingPlayerId = "";
	}

	public isCardHandPlayable(other: CardHandState): boolean {
		const topCardHand = this.getTopCardHand();
		if (topCardHand === undefined)
			return (true);
		if (this.isPlayerLeading(other.playerId))
			return (true);
		if (other.handType !== topCardHand.handType)
			return (false);
		// Comparing
		if (other.handType === HandType.Single || other.handType === HandType.Double || other.handType === HandType.Triple) {
			if (other.cards[0].rank > topCardHand.cards[0].rank)
				return (true);
			else if (other.cards[0].rank === topCardHand.cards[0].rank && other.cards[0].suit > topCardHand.cards[0].suit)
				return (true);
		}
		else if (other.handType === HandType.Pentuple) {
			if (other.pentupleType > topCardHand.pentupleType)
				return (true);
			else if (other.pentupleType < topCardHand.pentupleType)
				return (false);
			if (other.pentupleType === PentupleType.Straight || other.pentupleType === PentupleType.Flush || other.pentupleType === PentupleType.StraightFlush) {
				if (other.cards[0].rank > topCardHand.cards[0].rank)
					return (true);
				else if (other.cards[0].rank === topCardHand.cards[0].rank && other.cards[0].suit > topCardHand.cards[0].suit)
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

	public reset() {
		this.cardHands.length = 0;
		this.leadingPlayerId = "";
		this.requiresThreeDiamonds = true;
	}

	public transmit(): Array<CardHandTransmit> {
		return (this.cardHands)
	}
}