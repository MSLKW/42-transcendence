import { Request, Response } from "express";
import { ClientManager } from "../client/ClientManager";

export function checkUuidOnline(clientManager: ClientManager)
{
	return ((req: Request, res: Response) =>
	{
		const	client = clientManager.getByUuid(req.params.uuid as string)

		let body = {
			isOnline: false,
			inParty: false	
		};

		if (client)
		{
			body.isOnline = true;
			if (client.party.getState().members.length > 1)	
				body.inParty = true;
		}
		res.status(200).json(body);
	});	
}