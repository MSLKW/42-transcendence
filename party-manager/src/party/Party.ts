import { Client } from "../client/Client";
import { randomUUID } from "crypto";
import { PartyState } from "../PartyTransmitTypes";

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
		for (const key of this.members.keys())
				this.members.get(key)!.emit("party_state", this.getState());
		return (true);
	}

	removeUser(uuid: string)
	{
		if (uuid == this.hostId)
		{
			this.clear("the host has left");
			return ;
		}

		const user = this.members.get(uuid);
		if (!user)
			return ;
		user.status = "available";
		user.party = null;
		this.members.delete(uuid);
		for (const key of this.members.keys())
			this.members.get(key)!.emit("player_state", this.getState());
	}

	clear(reason: string)
	{
		for (const key of this.members.keys())
		{
			const user = this.members.get(key)!;

			user.status = "available";
			user.party = null;
			user.emit("kicked", {message: reason});
		}
		this.invites.clear();
		this.members.clear();
	}

	getMemberUuids(): string[]
	{
		return ([...this.members.keys()]);
	}

	getState(): PartyState
	{
		return ({
			hostUuid: this.hostId,
			members: [...this.members.keys()]
		});
	}
}