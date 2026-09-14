import { Request, Response } from "express";
import { ClientManager } from "../client/ClientManager";

export function checkUuidOnline(clientManager: ClientManager)
{
	return ((req: Request, res: Response) => {
		if (clientManager.getByUuid(req.params.uuid as string))
			res.status(200).json({ isOnline: true });
		else
			res.status(200).json({ isOnline: false });
	});	
}