import { Socket } from "socket.io-client";
import { useChatStore } from "../../../store/ChatStore";

export function connectionHandlers(
	socket: Socket
) {
	socket.on("connect", () => {
		const socketId = socket?.id ?? null;
		useChatStore.setState({ chatSocketId: socketId });

		if (useChatStore.getState().chatVerboseMode)
			console.log("[chat > 'on' connect] id:", socketId);
	});

	socket.on("disconnect", (reason) => {
		// Keep the selected room so ChatSocketService can rejoin after reconnecting.
		useChatStore.setState({ chatSocketId: null });

		if (useChatStore.getState().chatVerboseMode)
			console.log("[chat > 'on' disconnect] reason:", reason);
	});

	socket.on("connect_error", (error) => {
		if (useChatStore.getState().chatVerboseMode)
			console.warn("[chat > 'on' connect_error] error:", error.message);
	});
}
