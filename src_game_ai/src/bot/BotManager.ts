import { Bot } from "./Bot";
import { randomUUID } from "crypto"; 
import { RandomController } from "../ai/RandomController";

export class BotManager {
	private bots: Bot[];

	constructor()
	{
		this.bots = [];
	}

	addBot(serverUrl: string): string
	{
		const id = randomUUID();
		this.bots.push(new Bot(id, serverUrl, new RandomController));
		return id;
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
