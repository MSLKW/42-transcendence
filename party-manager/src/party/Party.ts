import { Client } from "../client/Client";
import { randomUUID } from "crypto";
import { PartyState } from "../PartyTransmitTypes";

const GAME_SERVICE_URL = process.env.GAME_SERVICE_URL;
if (!GAME_SERVICE_URL)
	throw new Error("GAME_SERVICE_URL is not set");

export class Party
{
	
	public readonly id:		string;
	public readonly hostId:	string;
	
	private invites = new Map<string, Client>();
	private members = new Map<string, Client>();
	gameId: string | null = null;

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
		this.sendUpdates();
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
		this.sendUpdates();			
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

	async startGameSession()
	{
		try
		{
			const response = await fetch(`${GAME_SERVICE_URL}/lobby`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					hostUuid: this.hostId,
					playersLimit: 4,
					playerUuids: [...this.members.keys()]
				})
			});
			if (!response.ok)
			{
				console.error("could not create game session", response.status);
				return ;
			}
			const data = await response.json();
			this.gameId = data.lobbySessionId;
			for (const key of this.members.keys())
				this.members.get(key)!.emit("game_session_start", {gameId: this.gameId});
		}
		catch (err)
		{
			console.error("call to game lobby failed", err);
		}
	}

	sendUpdates()
	{
		for (const key of this.members.keys())
				this.members.get(key)!.emit("party_state", this.getState());
		if (this.gameId)
			this.updateLobby();
	}

	async updateLobby()
	{
		try
		{
			const response = await fetch(`${GAME_SERVICE_URL}/lobby/${this.gameId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json"

				},
				body: JSON.stringify({
					hostUuid: this.hostId,
					playersLimit: 4,
					playerUuids: [...this.members.keys()]
				})
			});
			if (!response.ok)
				console.error("could not update game session", response.status);
		}
		catch (err)
		{
			console.error("call to game lobby failed", err)
		}
	}

	getState(): PartyState
	{
		return ({
			hostUuid: this.hostId,
			members: [...this.members.keys()],
			gameId: this.gameId
		});
	}
}