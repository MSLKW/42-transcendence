import { Request } from "express";
import { AUTH_SERVICE_URL } from "../config";

export async function authenticate(req: Request)
{
	return (await fetch(`${AUTH_SERVICE_URL}/validate`, {
		headers: {
			Cookie: req.headers.cookie || "",
			Authorization: req.get("Authorization") || ""
		}
	}));
}