import { useProfileStore } from "../../store/ProfileStore";
import { useSceneStore } from "../../store/SceneStore";
import { AvatarImage } from "./image/AvatarImage";
import { AvatarName } from "./name/AvatarName";
import { AvatarCornerButton } from "./corner/AvatarCornerButton";
import { ChatBubbles } from "../bubble/ChatBubble";

interface AvatarModuleProps {
	uuid: string;
	image: string | undefined;
	cornerButton?: string | number;
	isActive?: boolean;
	showName?: boolean;
}

export const AvatarModule = ({
	uuid,
	image,
	cornerButton = "",
	isActive = false,
	showName = true,
}: AvatarModuleProps) => {
	const cachedData = useProfileStore((store) => store.cachedData);
	const currentScene = useSceneStore((store) => store.currentScene);
	const setShowWindow = useSceneStore((store) => store.setShowWindow);

	const relation = cachedData[uuid ?? ""]?.relation ?? null;

	return (
		<div className="
			flex flex-col place-content-center place-items-center
			gap-0.75rem
			relative
		">
			<ChatBubbles uuid={uuid} />
			<button
				data-tip={
					relation === "Self" && currentScene !== "Game" ? "Edit Profile" :
					relation === "Bot" ? "Set Bot Settings" :
					"View Profile"
				}
				onClick={(e) => {
					e.currentTarget.blur();

					if (relation === "Self" && currentScene !== "Game")
						setShowWindow("profile", true);
					else if (relation === "Bot")
						setShowWindow("bots", true);
					else
						setShowWindow("stats", true, uuid);
				}}
				className={`
					rounded-xs
					${ relation === "Self" && currentScene === "Game"
						? ""
						: "hover:not-disabled:scale-105 active:hover:not-disabled:scale-100 focus-visible:outline-2 cursor-pointer"
					}
					${ relation === "Self" && currentScene === "Game"
						? ""
						: cornerButton ? "data-tip-up" : "data-tip-up"
					}
					outline-b5
					relative
				`}
			>
				<AvatarImage
					uuid={uuid}
					image={image ?? undefined}
					isActive={isActive}
				/>
				<AvatarCornerButton cornerButton={cornerButton} />
			</button>
			{ showName && <AvatarName name={cachedData[uuid?? ""]?.name ?? "-"} /> }
		</div>
	);
}