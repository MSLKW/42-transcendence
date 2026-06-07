import { Card } from './Card.ts';
import { HandType, PentupleType, CardRank, CardSuite, CardHandTransmit} from '../src_shared/Types.ts'

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
		this.cards.sort(this.sortCards);
		this.evaluateHandType();
		return (true);
	}

	public removeCard(card: Card): boolean {
		if (this.cards.length == 0) {
			console.log('CardHand is empty');
			return (false);
		}
		let index = this.cards.indexOf(card);
		if (index == -1) {
			console.log('Card to remove not found');
			return (false);
		}
		this.cards.splice(index, 1);
		this.cards.sort(this.sortCards);
		this.evaluateHandType();
		return (true);
	}

	public disposeCards() {
		for (let i = 0; i < this.cards.length; i++) {
			this.cards[i].dispose();
		}
	}

	// Sorts the cards by descending from rank first, then suite if the rank is the same
	public sortCards(a: Card, b: Card) {
		if (b.rank - a.rank === 0)
			return (b.suite - a.suite);
		return (b.rank - a.rank);
	}

	private evaluateHandType() {
		if (this.cards.length === 1) {
			this.handType = HandType.Single;
		}
		else if (this.cards.length === 2 && this.isDouble()) {
			this.handType = HandType.Double;
		}
		else if (this.cards.length === 3 && this.isTriple()) {
			this.handType = HandType.Triple;
		}
		else if (this.cards.length === 5) {
			this.handType = HandType.Pentuple;
			this.pentupleType = this.evaluatePentupleType();
		}
		else {
			this.handType = HandType.None;
			this.pentupleType = PentupleType.None;
		}
	}

	private evaluatePentupleType(): PentupleType {
		if (this.cards.length !== 5)
			return (PentupleType.None);
		if (this.isStraight() && this.isFlush())
			return (PentupleType.StraightFlush);
		if (this.isFourOfAKind())
			return (PentupleType.FourOfAKind);
		if (this.isFullHouse())
			return (PentupleType.FullHouse);
		if (this.isFlush())
			return (PentupleType.Flush);
		if (this.isStraight())
			return (PentupleType.Straight);
		return (PentupleType.None);
	}

	private isDouble(): boolean {
		if (this.cards.length !== 2)
			return (false);
		if (this.cards[0].rank !== this.cards[1].rank)
			return (false);
		return (true);
	}

	private isTriple(): boolean {
		if (this.cards.length !== 3)
			return (false);
		if (this.cards[0].rank === this.cards[1].rank && this.cards[1].rank === this.cards[2].rank)
			return (true);
		return (false);
	}

	private isStraight(): boolean {
		if (this.cards.length !== 5)
			return (false);
		let rank: CardRank = this.cards[0].rank;
		for (let i = 1; i < 5; i++) {
			if (this.cards[i].rank !== rank - 1)
				return (false);
			rank = this.cards[i].rank;
		}
		return (true);
	}

	private isFlush(): boolean  {
		if (this.cards.length !== 5)
			return (false);
		let suite: CardSuite = this.cards[0].suite;
		for (let i = 1; i < 5; i++) {
			if (this.cards[i].suite !== suite)
				return (false)
		}
		return (true);
	}

	private isFullHouse(): boolean {
		if (this.cards.length !== 5)
			return (false);
		const biggerThree = this.cards[0].rank === this.cards[1].rank && 
							this.cards[1].rank === this.cards[2].rank && 
							this.cards[3].rank == this.cards[4].rank;
		const smallerThree = this.cards[0].rank === this.cards[1].rank && 
							this.cards[2].rank === this.cards[3].rank && 
							this.cards[3].rank === this.cards[4].rank;
		if (biggerThree || smallerThree)
			return (true);
		return (false);
	}

	private isFourOfAKind(): boolean {
		if (this.cards.length !== 5)
			return (false);
		let rank: CardRank = this.cards[1].rank;
		for (let i = 2; i < 4; i++) {
			if (this.cards[i].rank !== rank)
				return (false);
		}
		if (this.cards[0].rank !== rank && this.cards[4].rank !== rank)
			return (false);
		return (true);
	}

	// Returns true if better, returns false if weaker
	public compare(other: CardHand): boolean {
		if (this.handType === HandType.Single || this.handType === HandType.Double || this.handType === HandType.Triple) {
			if (this.cards[0].rank > other.cards[0].rank)
				return (true);
			else if (this.cards[0].suite > other.cards[0].suite)
				return (true);
		}
		else if (this.handType === HandType.Pentuple) {
			if (this.pentupleType > other.pentupleType)
				return (true);
			if (this.pentupleType === PentupleType.Straight || this.pentupleType === PentupleType.StraightFlush) {
				if (this.cards[0].rank > other.cards[0].rank)
					return (true);
				else if (this.cards[0].suite > other.cards[0].suite)
					return (true);
			}
			else if (this.pentupleType === PentupleType.Flush) {
				if (this.cards[0].suite > other.cards[0].suite)
					return (true);
				else if (this.cards[0].rank > other.cards[0].rank)
					return (true);
			}
			else if (this.pentupleType === PentupleType.FullHouse || this.pentupleType === PentupleType.FourOfAKind) {
				if (this.cards[2].rank > other.cards[2].rank) {
					return (true);
				}
			}
		}
		return (false);
	}

	public toJSON(): CardHandTransmit {
		return {
			cards: this.cards,
			handType: this.handType,
			pentupleType: this.pentupleType,
			playerId: this.playerId
		}
	}
}