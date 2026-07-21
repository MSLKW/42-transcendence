import { Client } from "../client/Client";
import { randomUUID } from "crypto";

export class Party
{
	
	public readonly id:		string;
	public readonly hostId:	string;
	
	private invites = new Map<string, Client>();
	private members = new Map<string, Client>();

	constructor(host: Client)
	{
		this.id = randomUUID();
		if (host.status != "available")
			throw new Error("host is unavailable");
		host.status = "in_party";
		host.party = this;
		this.hostId = host.uuid;
		this.members.set(this.hostId, host);
	}

	addInvite(user: Client)
	{
		this.invites.set(user.uuid, user);
	}

	removeInvite(uuid: string)
	{
		if (this.invites.get(uuid))
			this.invites.delete(uuid);
	}

	addUser(userId: string): boolean
	{
		const user = this.invites.get(userId);

		if (!user)
			return (false);
		user.status = "in_party";
		user.party?.removeUser(userId);
		user.party = this;
		this.members.set(userId, user);
		this.invites.delete(userId);
		for (const key in this.members)
		{
			if (key == userId)
				continue ;
			this.members.get(key)!.emit("player_join", { userId });
		}
		return (true);
	}

	removeUser(uuid: string)
	{
		if (uuid == this.hostId)
			return ;

		const user = this.members.get(uuid);
		if (!user)
			return ;
		user.status = "available";
		user.party = null;
		this.members.delete(uuid);
		for (const key in this.members)
			this.members.get(key)!.emit("player_left", uuid);
	}

	clear()
	{
		for (const key in this.members)
		{
			const user = this.members.get(key)!;

			user.status = "available";
			user.party = null;
			user.emit("kicked", "The party was removed");
		}
	}

	getMemberUuids(): string[]
	{
		return ([...this.members.keys()]);
	}
}