import { useSceneStore } from "../../store/SceneStore";
import { AvatarImage } from "../image/AvatarImage";
import { AvatarName } from "../image/AvatarName";

interface AvatarProps {
	cornerButton?: string;
	playerIndex?: number;
	isActive?: boolean;
}

export const AvatarButton = ({ cornerButton = "none", playerIndex = 0, isActive = false }: AvatarProps) => {
	const { setShowWindow, setPlayerStatsFocus } = useSceneStore();

	return (
		<>
			<button
				data-tip={ playerIndex === 0 ? "Edit Profile" : "View Stats"}
				onClick={(e) => {
					if (playerIndex === 0)
						setShowWindow("profile", true);
					else
						setShowWindow("stats", true);
					setPlayerStatsFocus(playerIndex);
					e.currentTarget.blur();
				}}
				className="
					btn-avatar btn-tip-up h-max w-max
					flex flex-col place-content-center place-items-center
					gap-1
			">
				<AvatarImage cornerButton={cornerButton} isActive={isActive} />
				<AvatarName playerIndex={playerIndex} />
			</button>
		</>
	);
}