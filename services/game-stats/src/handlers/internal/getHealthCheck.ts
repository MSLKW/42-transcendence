import { Request, Response } from "express";

export function getHealthCheck(req: Request , res: Response)
{
	return (res.status(200).json({ message: "service is healthy "}));
}