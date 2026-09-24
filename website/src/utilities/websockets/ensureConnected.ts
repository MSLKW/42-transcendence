import { Socket } from "socket.io-client";

export function ensureConnected(socket: Socket): Promise<void> {
	if (socket.connected)
		return Promise.resolve();

	return new Promise((resolve, reject) => {
		const timeout = setTimeout(() => {
			cleanup();
			reject(new Error("Socket connection timeout"));
		}, 5000);

		const cleanup = () => {
			clearTimeout(timeout);
			socket.off("connect", handleConnect);
			socket.off("connect_error", handleError);
		};

		const handleConnect = () => {
			cleanup();
			resolve();
		};

		const handleError = (error: Error) => {
			cleanup();
			reject(error);
		};

		socket.once("connect", handleConnect);
		socket.once("connect_error", handleError);

		socket.connect();
	});
}