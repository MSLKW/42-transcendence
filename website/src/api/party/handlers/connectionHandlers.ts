import { Socket } from "socket.io-client";
import { usePartyStore } from "../../../store/PartyStore";

export function registerConnectionHandlers(socket: Socket, setIsConnecting: (value: boolean) => void) {
	socket.on("connect", () => {
		setIsConnecting(false);
		usePartyStore.setState({ partySocketId: socket?.id });
		console.log("[partySocket] 'connect' id:", socket?.id);
	});

	socket.on("disconnect", (reason) => {
		setIsConnecting(false);
		usePartyStore.setState({ partySocketId: null });
		console.log("[partySocket] 'disconnect' reason:", reason);
	});

	socket.on("connect_error", (error) => {
		setIsConnecting(false);
		console.log("[partySocket] 'connect_error' message:", error.message);
	});
}