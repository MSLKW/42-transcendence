import { Tooltip } from "../../../utilities/react/Tooltip";
import { useAuthStore } from "../../../store/AuthStore";
import { useGameStore } from "../../../store/GameStore";
import { usePartyStore } from "../../../store/PartyStore";
import { useSceneStore } from "../../../store/SceneStore";
import { BackIcon } from "./BackIcon";

export const BackButton = () => {
	const currentScene = useSceneStore((store) => store.currentScene);
	const members = usePartyStore((store) => store.members);
	const hostUuid = usePartyStore((store) => store.hostUuid);
	const clientUuid = useAuthStore((store) => store.clientUuid);

	const handleBackClick = () => {
		if (
			currentScene === "Game" || 
			(currentScene === "Lobby" && members.length > 1 && hostUuid !== clientUuid)
		) {
			useSceneStore.getState().setShowWindow("leave", true);
			return;
		}
		useGameStore.getState().leaveGame();
	};

	return (
		<button
			type="button"
			onClick={handleBackClick}
			className="btn-icon"
		>
			<Tooltip text="Back" position="bottom">
				<BackIcon />
			</Tooltip>
		</button>
	);
}