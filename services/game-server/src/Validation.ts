import { z } from 'zod';

const statusCallback = z.function()

export interface CardTransmit {
	rank: CardRank;
	suit: CardSuit;
}

export interface CardHandTransmit {
	cards: Array<CardTransmit>;
	handType: HandType;
	pentupleType: PentupleType;
	playerId: string;
}

export const eventValidationRegistry = {
	"user_seat_take": z.number(),
	// "user_seat_leave": 
	"user_seat_change": z.number(),
	"player_play_card_hand_request": cardHandTransmit,
	// "player_skip_turn_request": 
	// "game_start_request": 
	// "game_settings_set": GameSettingsTransmit
}