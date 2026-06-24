import { Bot } from "./Bot";
import { randomUUID } from "crypto"; 

export class BotManager {
	private bots: Bot[];

	constructor()
	{
		this.bots = [];
	}

	addBot(serverUrl: string): string
	{
		let id = randomUUID();
		this.bots.push(new Bot(id, serverUrl));
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
