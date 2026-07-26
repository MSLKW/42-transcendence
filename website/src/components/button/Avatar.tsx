import { useSceneStore } from "../../store/SceneStore";
import { RELATION, usePartyStore, type RelationType } from "../../store/PartyStore";
import { AvatarImage } from "../image/AvatarImage";
import { AvatarName } from "../label/AvatarName";

interface AvatarProps {
	index: number,
	name: string,
	relation: RelationType,
	cornerButton?: string;
	playerIndex?: number;
	isActive?: boolean;
}

export const AvatarButton = ({ index, name, relation, cornerButton = "", isActive = false }: AvatarProps) => {
	const { setSceneValue, setShowWindow } = useSceneStore();
	const { members } = usePartyStore();

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

					setSceneValue("profileIndex", index);
					if (relation === RELATION.SELF)
						setShowWindow("profile", true);
					else if (relation === RELATION.BOT)
						setShowWindow("bots", true);
					else
						setShowWindow("stats", true);
				}}
				className={`
					rounded-xs h-full
					hover:not-disabled:scale-105 active:hover:not-disabled:scale-100
					focus-visible:outline-2 ${ members[index].isHost ? "btn-tip-up2" : "btn-tip" } w-max
					flex flex-col place-content-center place-items-center
					gap-0.5rem
				`}
			>
				<AvatarImage cornerButton={cornerButton} isActive={isActive} />
				<AvatarName name={name} />
			</button>
		</>
	);
}