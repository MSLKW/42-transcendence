import { z } from 'zod';
import * as t from './Types.js';

export const CardRankSchema = z.enum(t.CardRank);
export const CardSuitSchema = z.enum(t.CardSuit);

export const HandTypeSchema = z.enum(t.HandType);
export const PentupleTypeSchema = z.enum(t.PentupleType);

export const CardTransmitSchema = z.object({
	rank: CardRankSchema,
	suit: CardSuitSchema
});

export const CardHandTransmitSchema = z.object({
	cards: z.array(CardTransmitSchema),
	handType: HandTypeSchema,
	pentupleType: PentupleTypeSchema,
	playerId: z.string()
});

export const GameSettingsTransmitSchema = z.object({
	allow3OfAKind: z.boolean(),
	allow2OfSpadesEnd: z.boolean(),
	autoPassInMilliseconds: z.number(),
});

export const GameStateTransmitSchema = z.object({
	cardHeap: z.array(CardHandTransmitSchema),
	playerCardsAmount: z.record(z.string(), z.number()),
	playerSeatOrder: z.record(z.string(), z.number()),
	playerCards: z.array(CardTransmitSchema),
	isPlayerTurn: z.boolean(),
	initialize: z.boolean(),
	gameSettings: GameSettingsTransmitSchema
});

export const GameEndStatsTransmitSchema = z.object({
	uuid: z.uuid(),
	winnerPlayerUuid: z.string(),
	playerFinalCardAmounts: z.record(z.string(), z.int().nonnegative()),
	playerPenaltyPoints: z.record(z.string(), z.int().nonnegative()),
	playerXpGains: z.record(z.string(), z.int().nonnegative()),
	temporaryWinStreakAmount: z.int().nonnegative(),
	temporaryRoundsPlayed: z.int().nonnegative(),
});

export const SeatOrderTransmitSchema = z.object({
	totalSeats: z.number(),
	seatOrder: z.array(z.union([z.string(), z.null()])),
});

export const StatusTransmitSchema = z.object({
	success: z.boolean(),
	message: z.string(),
});

export const PlayerTurnTransmitSchema = z.object({
	playerId: z.string(),
	skippable: z.boolean(),
	lowestCardRequired: CardTransmitSchema.or(z.undefined()),
	timer: z.number(),
	remainingTimer: z.number()
});

export const SkipTurnTransmit = z.object({
	playerId: z.string(),
});

export const StatusCallbackSchema = z.function({
	input: [StatusTransmitSchema],
	output: z.void(),
});
