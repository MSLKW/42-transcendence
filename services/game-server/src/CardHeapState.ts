import { CardRank, CardSuit, CardHandTransmit, CardTransmit, GameSettingsTransmit, HandType, PentupleType } from '@big2/game-types';
import { PlayerState } from "./PlayerState.js";
import { CardHandState } from "./CardHandState.js";
import { io } from "./server.js";

export class CardHeapState {
	private cardHands: Array<CardHandState>;
	private	leadingPlayerId: string;
	public	requiresLowestCard: boolean;
	private lowestCardRank: CardRank;
	private lowestCardSuit: CardSuit;
	private	gameSettingsRef: GameSettingsTransmit

	constructor(gameSettingsRef: GameSettingsTransmit) {
		this.cardHands = [];
		this.leadingPlayerId = "";
		this.requiresLowestCard = true;
		this.gameSettingsRef = gameSettingsRef;
		this.lowestCardRank = CardRank.Three;
		this.lowestCardSuit = CardSuit.Diamond;
	}

	public receiveCardHand(cardHand: CardHandState) {
		this.cardHands.push(cardHand);
		this.leadingPlayerId = cardHand.playerId;
		this.requiresLowestCard = false;
	}

	public cardHandsAmount() {
		return (this.cardHands.length);
	}

	public getTopCardHand(): CardHandState | undefined {
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
		if (this.gameSettingsRef.allow3OfAKind === false && other.handType === HandType.Triple)
			return (false);
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

	public checkLowestCardRequirement(cardhand: CardHandState) {
		return (this.requiresLowestCard === true && PlayerState.hasCard(cardhand.cards, this.lowestCardRank, this.lowestCardSuit) === false);
	}

	public setLowestCard(rank: CardRank, suit: CardSuit) {
		this.lowestCardRank = rank;
		this.lowestCardSuit = suit;
	}

	public getLowestCard(): CardTransmit | undefined {
		if (this.requiresLowestCard === false) {
			return (undefined);
		}
		const cardTransmit: CardTransmit = {
			rank: this.lowestCardRank,
			suit: this.lowestCardSuit
		}
		return (cardTransmit);
	}

	public reset() {
		this.cardHands.length = 0;
		this.leadingPlayerId = "";
		this.requiresLowestCard = true;
		this.lowestCardRank = CardRank.Three;
		this.lowestCardSuit = CardSuit.Diamond;
	}

	public transmit(): Array<CardHandTransmit> {
		return (this.cardHands)
	}
}