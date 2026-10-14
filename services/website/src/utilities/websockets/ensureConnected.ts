import { Socket } from "socket.io-client";

export function ensureConnected(socket: Socket): Promise<void> {
	if (socket.connected)
		return Promise.resolve();

	return new Promise((resolve, reject) => {
		const timeout = setTimeout(() => {
			cleanup();
			reject(new Error("Socket connection timeout"));
		}, 10000);

		const cleanup = () => {
			clearTimeout(timeout);
			socket.off("connect", handleConnect);
		};

		const handleConnect = () => {
			cleanup();
			resolve();
		};

		socket.once("connect", handleConnect);

		if (!socket.active)
			socket.connect();
	});
}