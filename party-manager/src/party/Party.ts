import { Client } from "../client/Client";
import { PartyState } from "../PartyTransmitTypes";

const GAME_SERVICE_URL = process.env.GAME_SERVICE_URL;
if (!GAME_SERVICE_URL)
	throw new Error("GAME_SERVICE_URL is not set");

export class Party
{
	public hostId:	string;
	
	private invites = new Map<string, Client>();
	private members = new Map<string, Client>();
	gameId: string | null = null;

	constructor(host: Client)
	{
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
		this.emitToAll("player_joined", { uuid: userId });
		user.party.removeUser(userId);
		user.party = this;
		this.members.set(userId, user);
		this.invites.delete(userId);
		this.sendUpdates();
		return (true);
	}

	removeUser(uuid: string)
	{
		const user = this.members.get(uuid);
		if (!user)
			return ;
		user.party = new Party(user);
		this.members.delete(uuid);
		if (uuid == this.hostId)
			[this.hostId] = this.members.keys();
		this.emitToAll("player_left", { uuid: uuid });
		this.sendUpdates();			
	}

	clear(reason: string)
	{
		for (const key of this.members.keys())
		{
			const user = this.members.get(key)!;

			user.party = new Party(user);
			if (user.uuid != this.hostId)
			{
				user.emit("kicked", {message: reason});
				user.emitState();
			}
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
				this.members.get(key)!.emitState();
		}
		catch (err)
		{
			console.error("call to game lobby failed", err);
		}
	}

	sendUpdates()
	{
		for (const key of this.members.keys())
				this.members.get(key)!.emitState();
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

	emitToAll(event: string, payload: unknown)
	{
		for (const key of this.members.keys())
			this.members.get(key)!.emit(event, payload);
	}
}