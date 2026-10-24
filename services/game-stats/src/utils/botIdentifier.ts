import z from "zod";


export const BOT_PREFIX = "bot-";

export const hasBotPrefix = (value: string): boolean =>
	value.startsWith(BOT_PREFIX);

export const isBotUuid = (id: string): boolean =>
	(hasBotPrefix(id) && 
		z.uuid().safeParse(id.slice(BOT_PREFIX.length)).success);	
	// TODO: double check with game-bot how the uuid part is created
	// * use z.uuid() if uuid is created from crypto.randomUUID()
	// # use z.guid() if uuid is created from hand-made or custom generator in the 8-4-4-4-12 shape. 

