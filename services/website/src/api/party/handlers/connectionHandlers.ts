import { Socket } from "socket.io-client";
import { usePartyStore } from "../../../store/PartyStore";
import { useSceneStore } from "../../../store/SceneStore";
import { handleValidate } from "../../authentication/get_validate/handleValidate";
import { partySocket } from "../partySocket";

export function connectionHandlers(socket: Socket) {
	socket.on("connect", () => {
		if (usePartyStore.getState().partyVerboseMode)
			console.log("[party > 'on' connect] id:", socket?.id);

		usePartyStore.setState({ partySocketId: socket?.id });
	});

	socket.on("disconnect", (reason) => {
		if (usePartyStore.getState().partyVerboseMode)
			console.log("[party > 'on' disconnect] reason:", reason);

		usePartyStore.setState({
			partySocketId: null,
			hostUuid: null,
		});

		if (partySocket.isIntentionalDisconnect())
			return;

		if (useSceneStore.getState().currentScene !== "Login") {
			void handleValidate()
				.then(() => {
					useSceneStore.getState().setShowWindow("stale", true);
				})
				.catch((error) => {
					console.error("Session validation after disconnect failed:", error);
				})
		}
	});

	socket.on("connect_error", (error) => {
		if (usePartyStore.getState().partyVerboseMode)
			console.warn("[party > 'on' connect_error] message:", error.message);
	});
}