import { Socket } from "socket.io-client";
import { useAuthStore } from "../../../store/AuthStore";
import { useChatStore } from "../../../store/ChatStore";
import { usePartyStore } from "../../../store/PartyStore";

export function connectionHandlers(
	socket: Socket,
	joinRoom: (roomId: string) => void,
	setInitialRoom: (roomId: string) => void,
) {
	socket.on("connect", () => {
		const socketId = socket?.id ?? null;
		useChatStore.setState({ chatSocketId: socketId });

		const hostUuid = usePartyStore.getState().hostUuid;
		const clientUuid = useAuthStore.getState().clientUuid;
		if (hostUuid)
			joinRoom(hostUuid);
		else if (clientUuid)
			setInitialRoom(clientUuid);

		if (useChatStore.getState().chatVerboseMode)
			console.log("[chat > 'on' connect] id:", socketId);
	});

	socket.on("disconnect", (reason) => {
		useChatStore.setState({
			chatSocketId: null,
			chatRoomId: null,
		});

		if (useChatStore.getState().chatVerboseMode)
			console.log("[chat > 'on' disconnect] reason:", reason);
	});

	socket.on("connect_error", (error) => {
		if (useChatStore.getState().chatVerboseMode)
			console.warn("[chat > 'on' connect_error] error:", error.message);
	});
}