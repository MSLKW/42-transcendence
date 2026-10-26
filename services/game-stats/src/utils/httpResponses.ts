import { type Response } from "express";
import z from "zod";

export function respondInvalidRequestBody(res: Response, error: z.ZodError )
{
	console.error("Invalid request body:\n" + z.prettifyError(error));
	return (res.status(400).json({
		error: "invalid_request_body",
		message: z.prettifyError(error),
	}));
}

