import { Socket } from "socket.io-client";
import { usePartyStore } from "../../../store/PartyStore";
// import { refreshAction } from "../actions/refreshAction";

export function connectionHandlers(socket: Socket) {
	socket.on("connect", () => {
		// refreshAction(socket);

		usePartyStore.setState({
			partySocketId: socket?.id
		});

		if (usePartyStore.getState().partyVerboseMode)
			console.log("[party > 'on' connect] id:", socket?.id);
	});

	socket.on("disconnect", (reason) => {
		usePartyStore.setState({
			partySocketId: null,
			hostUuid: null,
		});

		if (usePartyStore.getState().partyVerboseMode)
			console.log("[party > 'on' disconnect] reason:", reason);
	});

	socket.on("connect_error", (error) => {
		if (usePartyStore.getState().partyVerboseMode)
			console.warn("[party > 'on' connect_error] message:", error.message);
	});
}