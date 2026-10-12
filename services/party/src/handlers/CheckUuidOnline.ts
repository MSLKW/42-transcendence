import { Request, Response } from "express";
import { UserData, UserStore } from "../store/UserStore";
import { ClientManager } from "../client/ClientManager";

export function checkUuidOnline(userStore: UserStore, clientManager: ClientManager)
{
	return (async (req: Request, res: Response) =>
	{
		const	uuid = req.params.uuid as string;
		const	client = clientManager.getByUuid(uuid);

		let body = {
			isOnline:	false,
			inParty:	false,
			lastOnline: null as Date | null
		};

		if (client)
		{
			body.isOnline = true;
			if (client.party.getState().members.length > 1)	
				body.inParty = true;
		}
		else
			body.lastOnline = (await userStore.getUser(uuid))?.lastOnline ?? null
		res.status(200).json(body);
	});	
}