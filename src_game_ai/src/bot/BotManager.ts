import { Bot } from "./Bot";
import { randomUUID } from "crypto"; 
import { AAIController } from "../ai/AAIController";

export class BotManager {
	private bots: Bot[];

	constructor()
	{
		this.bots = [];
	}

	addBot(name: string, serverUrl: string, ai: AAIController): string
	{
		const id = `${name}-${randomUUID().substring(0, 8)}`;
		this.bots.push(new Bot(id, serverUrl, ai));
		return (id);
	}

	startAll(): void
	{
		this.bots.forEach((bot) => bot.start());
	}

	stopAll(): void
	{
		this.bots.forEach((bot) => bot.stop());
	}
}
