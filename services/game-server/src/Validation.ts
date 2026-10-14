import { z } from 'zod';
import { CardHandTransmitSchema, GameSettingsTransmitSchema, StatusCallbackSchema } from '@big2/game-types/validation';

export interface EventConfig {
	payload?: z.ZodType;
	callback?: z.ZodFunction;
}

export const IncomingEventRegistry: Record<string, EventConfig> = {
	"user_seat_take": {
		payload: z.number(),
		callback: StatusCallbackSchema
	},
	"user_seat_leave": {
		callback: StatusCallbackSchema
	},
	"user_seat_change": {
		payload: z.number(),
		callback: StatusCallbackSchema
	},
	"player_play_card_hand_request": {
		payload: CardHandTransmitSchema,
		callback: StatusCallbackSchema
	},
	"player_skip_turn_request": {
		callback: StatusCallbackSchema
	},
	"game_start_request": {
		callback: StatusCallbackSchema
	},
	"lobby_delete_request": {
		callback: StatusCallbackSchema
	},
	"game_settings_set": {
		payload: GameSettingsTransmitSchema,
		callback: StatusCallbackSchema
	},
	"bot_add": {
		payload: z.number(),
		callback: StatusCallbackSchema
	},
	"bot_remove": {
		payload: z.string(),
		callback: StatusCallbackSchema
	}
}
