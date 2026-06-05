
export enum CardRank {
	Three,
	Four,
	Five,
	Six,
	Seven,
	Eight,
	Nine,
	Ten,
	Jack,
	Queen,
	King,
	Ace,
	Two
}

export enum CardSuite {
	Diamond,
	Club,
	Heart,
	Spade
}

export interface CardTransmit {
	rank: CardRank;
	suite: CardSuite;
}

export enum HandType {
	None,
	Single,
	Double,
	Triple,
	Pentuple
};

export enum PentupleType {
	None,
	Straight,
	Flush,
	FullHouse,
	FourOfAKind,
	StraightFlush,
	// RoyalFlush
}

export interface CardHandTransmit {
	cards: Array<CardTransmit>;
	handType: HandType;
	pentupleType: PentupleType;
}