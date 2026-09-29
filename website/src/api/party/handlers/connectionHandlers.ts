import { Socket } from "socket.io-client";
import { usePartyStore } from "../../../store/PartyStore";

export function connectionHandlers(socket: Socket) {
	socket.on("connect", () => {
		if (usePartyStore.getState().partyVerboseMode)
			console.log("[party > 'on' connect] id:", socket?.id);

		usePartyStore.setState({
			partySocketId: socket?.id
		});
	});

	socket.on("disconnect", (reason) => {
		if (usePartyStore.getState().partyVerboseMode)
			console.log("[party > 'on' disconnect] reason:", reason);

		usePartyStore.setState({
			partySocketId: null,
			hostUuid: null,
		});
	});

	socket.on("connect_error", (error) => {
		if (usePartyStore.getState().partyVerboseMode)
			console.warn("[party > 'on' connect_error] message:", error.message);
	});
}