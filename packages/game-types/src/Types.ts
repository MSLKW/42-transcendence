
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
	Two,
	Unknown
}

export enum CardSuit {
	Diamond,
	Club,
	Heart,
	Spade
}

export interface CardTransmit {
	rank: CardRank;
	suit: CardSuit;
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
	playerId: string;
}

export type GameStateTransmit = {
	cardHeap: Array<CardHandTransmit>,
	playerCardsAmount: Record<string, number>,
	playerSeatOrder: Record<string, number>,
	playerCards: Array<CardTransmit>,
	isPlayerTurn: boolean
}

export type GameSettingsTransmit = {
	allow3OfAKind: boolean,
	allow2OfSpadesEnd: boolean,
	autoPassInMilliseconds: number,
	endGameCondition: number,
	scoreCalculation: number,
}

export type GameEndStatsTransmit = {
	winnerPlayerUuid: string,
	playerFinalCardAmounts: Record<string, number>,
	playerPenaltyPoints: Record<string, number>,
	temporaryWinStreakAmount: number,
	temporaryRoundsPlayed: number,
}

export type SeatOrderTransmit = {
	totalSeats: number,
	seatOrder: (string | null)[]
}

export type StatusTransmit = {
	success: boolean,
	message: string
}

export type PlayerTurnTransmit = {
	playerId: string,
	skippable: boolean,
	timer: number
}

export type SkipTurnTransmit = {
	playerId: string
}