import z from "zod";


export const BOT_PREFIX = "bot-";

export function hasBotPrefix(value: string | null): boolean
{
	if (!value)
		return false;
	return (value.startsWith(BOT_PREFIX));
}

export const isBotUuid = (id: string): boolean =>
	(hasBotPrefix(id) && 
		z.uuid().safeParse(id.slice(BOT_PREFIX.length)).success);	
	// TODO: double check with game-bot how the uuid part is created
	// * use z.uuid() if uuid is created from crypto.randomUUID()
	// # use z.guid() if uuid is created from hand-made or custom generator in the 8-4-4-4-12 shape. 

