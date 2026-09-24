import { Socket } from "socket.io-client";
import { useAuthStore } from "../../../store/AuthStore";
import { useChatStore } from "../../../store/ChatStore";
import { usePartyStore } from "../../../store/PartyStore";

export function registerConnectionHandlers(
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

		console.log("[chatSocket] Connected to chat service with id:", socketId);
	});

	socket.on("disconnect", (reason) => {
		useChatStore.setState({
			chatSocketId: null,
			chatRoomId: null,
		});

		console.log("[chatSocket] Disconnected:", reason);
	});

	socket.on("connect_error", (err) => {
		console.error("[chatSocket] Connection error:", err.message);
	});
}