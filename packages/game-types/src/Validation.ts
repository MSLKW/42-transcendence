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

export const GameStateTransmitSchema = z.object({
	cardHeap: z.array(CardHandTransmitSchema),
	playerCardsAmount: z.record(z.string(), z.number()),
	playerSeatOrder: z.record(z.string(), z.number()),
	playerCards: z.array(CardTransmitSchema),
	isPlayerTurn: z.boolean()
});

export const GameSettingsTransmitSchema = z.object({
	allow3OfAKind: z.boolean(),
	allow2OfSpadesEnd: z.boolean(),
	autoPassInMilliseconds: z.number(),
	endGameCondition: z.number(),
	scoreCalculation: z.number(),
});

export const GameEndStatsTransmitSchema = z.object({
	winnerPlayerUuid: z.string(),
	playerFinalCardAmounts: z.record(z.string(), z.number()),
	playerPenaltyPoints: z.record(z.string(), z.number()),
	temporaryWinStreakAmount: z.number(),
	temporaryRoundsPlayed: z.number(),
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
	timer: z.number()
});

export const SkipTurnTransmit = z.object({
	playerId: z.string(),
});

export const StatusCallbackSchema = z.function({
	input: [StatusTransmitSchema],
	output: z.void(),
});
