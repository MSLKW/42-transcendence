import { CardTransmit, CardRank, CardSuit, CardHandTransmit, HandType, PentupleType } from "@bigtwo/shared";

export class CardHandState {
	public readonly cards: Array<CardTransmit>;
	public	handType: HandType = HandType.None;
	public	pentupleType: PentupleType = PentupleType.None;
	public	playerId: string;

	constructor(cards: Array<CardTransmit>, playerId: string) {
		this.cards = cards;
		this.playerId = playerId;
		this.cards.sort(this.sortCards);
		this.evaluateHandType();
	}

	public compareTypes(cardHand: CardHandTransmit) {
		return (this.handType === cardHand.handType && this.pentupleType === cardHand.pentupleType)
	}

	public sortCards(a: CardTransmit, b: CardTransmit) {
		if (b.rank - a.rank === 0)
			return (b.suit - a.suit);
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
		let suit: CardSuit = this.cards[0].suit;
		for (let i = 1; i < 5; i++) {
			if (this.cards[i].suit !== suit)
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

	public transmit(): CardHandTransmit {
		return {
			cards: this.cards,
			handType: this.handType,
			pentupleType: this.pentupleType,
			playerId: this.playerId
		}
	}
}