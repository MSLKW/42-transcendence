import { useSceneStore } from "../../store/SceneStore";
import { RELATION, type RelationType } from "../../store/PartyStore";
import { AvatarImage } from "../image/AvatarImage";
import { AvatarName } from "../label/AvatarName";

interface AvatarProps {
	uuid: string,
	name: string,
	relation: RelationType,
	cornerButton?: string;
	playerIndex?: number;
	isActive?: boolean;
}

export const AvatarButton = ({ uuid, name, relation, cornerButton = "", isActive = false }: AvatarProps) => {
	const { setSceneValue, setShowWindow } = useSceneStore();

	return (
		<>
			<button
				data-tip={
					relation === RELATION.SELF ? "Edit Profile" :
					relation === RELATION.BOT ? "Choose Bot"
					: "View Stats"
				}
				onClick={(e) => {
					e.currentTarget.blur();

					setSceneValue("profileUUID", uuid);
					if (relation === RELATION.SELF)
						setShowWindow("profile", true);
					else if (relation === RELATION.BOT)
						setShowWindow("bots", true);
					else
						setShowWindow("stats", true);
				}}
				className="
					btn-avatar btn-tip-up h-max w-max
					flex flex-col place-content-center place-items-center
					gap-1
			">
				<AvatarImage cornerButton={cornerButton} isActive={isActive} />
				<AvatarName name={name} />
			</button>
		</>
	);
}