import { Tooltip } from "../../../utilities/react/Tooltip";
import { useAuthStore } from "../../../store/AuthStore";
import { useGameStore } from "../../../store/GameStore";
import { usePartyStore } from "../../../store/PartyStore";
import { useSceneStore } from "../../../store/SceneStore";
import { BackIcon } from "./BackIcon";

export const BackButton = () => {
	const leaveGame = useGameStore((store) => store.leaveGame);
	const currentScene = useSceneStore((store) => store.currentScene);
	const setShowWindow = useSceneStore((store) => store.setShowWindow);
	const members = usePartyStore((store) => store.members);
	const hostUuid = usePartyStore((store) => store.hostUuid);
	const clientUuid = useAuthStore((store) => store.clientUuid);

	const handleBackClick = () => {
		if (
			currentScene === "Game" || 
			(currentScene === "Lobby" && members.length > 1 && hostUuid !== clientUuid)
		) {
			setShowWindow("leave", true);
			return;
		}
		leaveGame();
	};

	return (
		<button
			onClick={handleBackClick}
			className="btn-icon"
		>
			<Tooltip text="Back" position="bottom">
				<BackIcon />
			</Tooltip>
		</button>
	);
}