import { Bot } from "./Bot";
import { randomUUID } from "crypto"; 
import { AAIController } from "../ai/AAIController";

export class BotManager
{
	private bots: Map<string, Bot> = new Map<string, Bot>;

	addBot(name: string, serverUrl: string, ai: AAIController): string
	{
		const id = `${name}-${randomUUID()}`;
		
		this.bots.set(id, new Bot(id, serverUrl, ai));
		return id;
	}

	removeBot(id: string)
	{
		this.bots.delete(id);
	}

	getBot(id: string): Bot | null
	{
		const bot = this.bots.get(id);
		return bot ?? null;
	}

	stopAll(): void
	{
		this.bots.forEach((bot) => bot.stop());
	}
}
