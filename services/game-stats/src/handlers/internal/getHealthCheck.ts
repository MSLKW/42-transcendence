import { RequestHandler } from "express";

export const getHealthCheck: RequestHandler = (req, res) =>
{
	res.status(200).json({ 
		status: "healthy",
		message: "service is serving, dandy & healthy!"});
		// "The server is a certified slayer today!"
}

// advantage using const (Const Arrow Function) for handler:
// Safety: unlike previous implementation using function (Function Declaration),
// const cannot accidentally be reassigned or overwritten anywhere else in the codebase.