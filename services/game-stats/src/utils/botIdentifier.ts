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

