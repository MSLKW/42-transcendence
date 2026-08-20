import { usePartyStore } from "../../store/PartyStore";
import { useSceneStore } from "../../store/SceneStore";
import { AvatarImage } from "./image/AvatarImage";
import { AvatarName } from "./name/AvatarName";
import { AvatarCornerButton } from "./corner/AvatarCornerButton";

interface AvatarModuleProps {
	uuid: string,
	cornerButton?: string | number;
	isActive?: boolean;
	showName?: boolean;
}

export const AvatarModule = ({
	uuid,
	cornerButton = "",
	isActive = false,
	showName = true,
}: AvatarModuleProps) => {
	const { getMemberData } = usePartyStore();
	const { currentScene, setShowWindow, setSceneValue } = useSceneStore();

	const data = getMemberData(uuid);
	if (!data)
		return null;

	return (
		<div
			className="
				flex flex-col place-content-center place-items-center
				gap-0.75rem
			"
		>
			<button
				data-tip={
					data.relation === "Self" && currentScene !== "Game" ? "Edit Profile" :
					data.relation === "Bot" ? "Set Bot Settings" :
					(data.relation === "Stranger" || data.relation === "Friend") ? "View Profile" :
					""
				}
				onClick={(e) => {
					e.currentTarget.blur();

					if (data.relation === "Self" && currentScene !== "Game")
						setShowWindow("profile", true);
					else if (data.relation === "Bot")
						setShowWindow("bots", true);
					else if (data.relation === "Stranger" || data.relation === "Friend") {
						setSceneValue("profileUuid", uuid);
						setShowWindow("stats", true, uuid);
					}
				}}
				className={`
					rounded-xs
					${ data.relation === "Self" && currentScene === "Game"
						? ""
						: "hover:not-disabled:scale-105 active:hover:not-disabled:scale-100 focus-visible:outline-2 cursor-pointer"
					}
					${ data.relation === "Self" && currentScene === "Game"
						? ""
						: cornerButton ? "data-tip-up" : "data-tip-up"
					}
					outline-b5
					relative
				`}
			>
				<AvatarImage isActive={isActive} />
				<AvatarCornerButton cornerButton={cornerButton}/>
			</button>
			{ showName && data.name && <AvatarName name={data.name} /> }
		</div>
	);
}