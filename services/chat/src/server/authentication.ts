import { Socket } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "../events";

/** Socket type used during chat authentication */
type ChatSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

/** Creates middleware that validates a socket's session */
export function createSocketAuthentication(authServiceUrl: string, isShuttingDown: () => boolean) {
	return async (socket: ChatSocket, next: (error?: Error) => void): Promise<void> => {
		if (isShuttingDown())
			return next(new Error("SERVICE_SHUTTING_DOWN"));

		const token = getSessionToken(socket);
		if (!token)
			return next(new Error("UNAUTHORIZED: no session token provided"));

		try {
			const response = await fetch(`${authServiceUrl}/validate`, {
				headers: {
					Cookie: socket.handshake.headers.cookie || "",
					Authorization: `Bearer ${token}`,
				},
				signal: AbortSignal.timeout(5000),
			});
			if (isShuttingDown())
				return next(new Error("SERVICE_SHUTTING_DOWN"));
			if (!response.ok)
				return next(new Error("UNAUTHORIZED: invalid or expired session"));

			const data = await response.json();
			if (typeof data.userId !== "string" || !data.userId) {
				console.error("Auth service returned an OK response with no valid uuid");
				return next(new Error("UNAUTHORIZED: malformed validation response"));
			}
			socket.data.uuid = data.userId;
			next();
		} catch (error) {
			console.error("Auth validation failed for chat:", error);
			next(new Error("UNAUTHORIZED: could not validate session"));
		}
	};
}

/** Reads the session token from the cookie or socket auth data */
function getSessionToken(socket: ChatSocket): string | undefined {
	const cookie = socket.handshake.headers.cookie;
	const sessionToken = cookie
		?.split(";")
		.map((part) => part.trim())
		.find((part) => part.startsWith("session_token="))
		?.slice("session_token=".length);
	if (sessionToken)
		return sessionToken;

	const authToken = socket.handshake.auth?.token;
	return typeof authToken === "string" ? authToken : undefined;
}
