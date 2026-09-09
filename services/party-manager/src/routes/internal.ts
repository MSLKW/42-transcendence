import { eq } from "drizzle-orm";
import { postgresClient } from "../store/postgresClient.js";
import { Request, Response } from "express";
import { playerStatus } from "@big2/party-manager-schema";


// export function getInternalPartyStatus() {
export function getInternalInfosForProfile() {
	return ( async (req: Request, res: Response) => {
		
		const id = req.params.id;
		if (!id)
			return res.status(404).json({ error: "User not found "});

		const status = await postgresClient
			.select()
			.from(playerStatus)
			.where(eq(playerStatus.id, id));

		return res.status(200).json(status);
	})
}