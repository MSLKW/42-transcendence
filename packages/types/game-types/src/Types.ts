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

// Convert this to zod validation later
export type AchievementUnlockTransmit = {
	playerUuid: string,
	achievementId: string,
	unlockedAt: string,
}

// Assumption of what the transmit game-stat will send me | will change to aisyah
export type PlayerStatsTransmit = {
	totalPlayed: number,
	totalWins: number,
	winstreak: number,
	unlockedBadges: Array<string>,
	unlockedAchievements: Array<AchievementUnlockTransmit>, 
	xp: number,
	level: number,
}

// ACHIEVEMENT IDS
export const ACHIEVEMENT_ID = [
	"best_single",
	"best_double",
	"best_triple",
	"best_straight",
	"best_flush",
	"best_full_house",
	"best_four_of_a_kind",
	"best_straight_flush",
	"play_three_diamonds",
	"play_two_spades",
	"win_no_pass",
	"first_win",
] as const;
export type AchievementId = typeof ACHIEVEMENT_ID[number];

export type CardTransmit = z.infer<typeof s.CardTransmitSchema>;
export type CardHandTransmit = z.infer<typeof s.CardHandTransmitSchema>;
export type GameStateTransmit = z.infer<typeof s.GameStateTransmitSchema>;
export type GameSettingsTransmit = z.infer<typeof s.GameSettingsTransmitSchema>;
export type GameEndStatsTransmit = z.infer<typeof s.GameEndStatsTransmitSchema>;
export type SeatOrderTransmit = z.infer<typeof s.SeatOrderTransmitSchema>;
export type StatusTransmit = z.infer<typeof s.StatusTransmitSchema>;
export type PlayerTurnTransmit = z.infer<typeof s.PlayerTurnTransmitSchema>;
export type SkipTurnTransmit = z.infer<typeof s.SkipTurnTransmit>;
