import { Request, Response } from "express"
import { ClientManager } from "../client/ClientManager"

export function getPartyMembers(manager: ClientManager)
{
	return (req: Request, res: Response) =>
	{
		const host = manager.getByUuid(req.params.hostUuid as string)

		if (host == undefined)
			return res.status(404).json({ error: "user not found" });
		if (host.party.hostId != host.uuid)
			return res.status(404).json({ error: "user is not a host" });
		return res.status(200).json({ members: [...host.party.getState().members] });
	}
}