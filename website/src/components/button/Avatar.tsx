import { usePartyStore } from "../../store/PartyStore";
import { useSceneStore } from "../../store/SceneStore";
import { AvatarImage } from "../image/AvatarImage";
import { AvatarName } from "../label/AvatarName";

interface AvatarProps {
	cornerButton?: string;
	playerIndex?: number;
	isActive?: boolean;
}

export const AvatarButton = ({ cornerButton = "none", playerIndex = 0, isActive = false }: AvatarProps) => {
	const { setPartyValue } = usePartyStore();
	const { setShowWindow } = useSceneStore();

	return (
		<>
			<button
				data-tip={ playerIndex === 0 ? "Edit Profile" : "View Stats"}
				onClick={(e) => {
					e.currentTarget.blur();
					console.log(playerIndex);
					if (playerIndex === 0) {
						setPartyValue("playerFocus", playerIndex);
						setShowWindow("profile", true);
					} else if (playerIndex > 0) {
						setPartyValue("playerFocus", playerIndex);
						setShowWindow("stats", true);
					}
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