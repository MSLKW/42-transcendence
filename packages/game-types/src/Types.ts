import { z } from "zod";
import * as s from './Validation.js';

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

export type CardTransmit = z.infer<typeof s.CardTransmitSchema>;
export type CardHandTransmit = z.infer<typeof s.CardHandTransmitSchema>;
export type GameStateTransmit = z.infer<typeof s.GameStateTransmitSchema>;
export type GameSettingsTransmit = z.infer<typeof s.GameSettingsTransmitSchema>;
export type GameEndStatsTransmit = z.infer<typeof s.GameEndStatsTransmitSchema>;
export type SeatOrderTransmit = z.infer<typeof s.SeatOrderTransmitSchema>;
export type StatusTransmit = z.infer<typeof s.StatusTransmitSchema>;
export type PlayerTurnTransmit = z.infer<typeof s.PlayerTurnTransmitSchema>;
export type SkipTurnTransmit = z.infer<typeof s.SkipTurnTransmit>;
