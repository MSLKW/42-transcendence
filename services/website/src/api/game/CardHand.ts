import { Card } from './Card';
import { HandType, PentupleType, CardRank, type CardHandTransmit} from '@big2/game-types';

export class CardHand {
	public readonly	cards: Array<Card>;
	public			handType: HandType = HandType.None;
	public			pentupleType: PentupleType = PentupleType.None;
	public			playerId: string;

	constructor(playerId: string) {
		this.cards = [];
		this.playerId = playerId;
	}

	public receiveCard(card: Card): boolean {
		if (this.cards.length >= 5) {
			console.log('CardHand is full');
			return (false);
		}
		this.cards.push(card);
		this.evaluateHandType();
		return (true);
	}

	public removeCard(card: Card): boolean {
		if (this.cards.length == 0) {
			return (false);
		}
		const index = this.cards.indexOf(card);
		if (index == -1) {
			return (false);
		}
		this.cards.splice(index, 1);
		this.evaluateHandType();
		return (true);
	}

	public disposeCards() {
		for (let i = 0; i < this.cards.length; i++) {
			this.cards[i].dispose();
		}
		this.cards.length = 0;
	}

	// Sorts the cards by descending from rank first, then suit if the rank is the same
	public sortCards(a: Card, b: Card) {
		if (b.rank - a.rank === 0)
			return (b.suit - a.suit);
		return (b.rank - a.rank);
	}

	private evaluateHandType() {
		const sortedCards: Card[] = [...this.cards].sort(this.sortCards);
		if (sortedCards.length === 1) {
			this.handType = HandType.Single;
		}
		else if (sortedCards.length === 2 && this.isDouble(sortedCards)) {
			this.handType = HandType.Double;
		}
		else if (sortedCards.length === 3 && this.isTriple(sortedCards)) {
			this.handType = HandType.Triple;
		}
		else if (sortedCards.length === 5) {
			this.handType = HandType.Pentuple;
			this.pentupleType = this.evaluatePentupleType(sortedCards);
		}
		else {
			this.handType = HandType.None;
			this.pentupleType = PentupleType.None;
		}
	}

	private evaluatePentupleType(cards: Card[]): PentupleType {
		if (cards.length !== 5)
			return (PentupleType.None);
		if (this.isStraight(cards) && this.isFlush(cards))
			return (PentupleType.StraightFlush);
		if (this.isFourOfAKind(cards))
			return (PentupleType.FourOfAKind);
		if (this.isFullHouse(cards))
			return (PentupleType.FullHouse);
		if (this.isFlush(cards))
			return (PentupleType.Flush);
		if (this.isStraight(cards))
			return (PentupleType.Straight);
		return (PentupleType.None);
	}

	private isDouble(cards: Card[]): boolean {
		if (cards.length !== 2)
			return (false);
		if (cards[0].rank !== cards[1].rank)
			return (false);
		return (true);
	}

	private isTriple(cards: Card[]): boolean {
		if (cards.length !== 3)
			return (false);
		if (cards[0].rank === cards[1].rank && cards[1].rank === cards[2].rank)
			return (true);
		return (false);
	}

	private isStraight(cards: Card[]): boolean {
		if (cards.length !== 5)
			return (false);
		let rank: CardRank = cards[0].rank;
		for (let i = 1; i < 5; i++) {
			if (cards[i].rank !== rank - 1)
				return (false);
			rank = cards[i].rank;
		}
		return (true);
	}

	private isFlush(cards: Card[]): boolean  {
		if (cards.length !== 5)
			return (false);
		for (let i = 1; i < 5; i++) {
			if (cards[i].suit !== cards[0].suit)
				return (false)
		}
		return (true);
	}

	private isFullHouse(cards: Card[]): boolean {
		if (cards.length !== 5)
			return (false);
		const biggerThree = cards[0].rank === cards[1].rank && 
							cards[1].rank === cards[2].rank && 
							cards[3].rank == cards[4].rank;
		const smallerThree = cards[0].rank === cards[1].rank && 
							cards[2].rank === cards[3].rank && 
							cards[3].rank === cards[4].rank;
		if (biggerThree || smallerThree)
			return (true);
		return (false);
	}

	private isFourOfAKind(cards: Card[]): boolean {
		if (cards.length !== 5)
			return (false);
		const rank: CardRank = cards[1].rank;
		for (let i = 2; i < 4; i++) {
			if (cards[i].rank !== rank)
				return (false);
		}
		if (cards[0].rank !== rank && cards[4].rank !== rank)
			return (false);
		return (true);
	}

	public transmit(): CardHandTransmit {
		return {
			cards: this.cards,
			handType: this.handType,
			pentupleType: this.pentupleType,
			playerId: this.playerId
		}
	}
}