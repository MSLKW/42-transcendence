import { useProfileStore } from "../../store/ProfileStore";
import { useSceneStore } from "../../store/SceneStore";
import { AvatarImage } from "./image/AvatarImage";
import { AvatarName } from "./name/AvatarName";
import { AvatarCornerButton } from "./corner/AvatarCornerButton";
import { ChatBubbles } from "../bubble/ChatBubble";
import { useAuthStore } from "../../store/AuthStore";
import { Tooltip } from "../../utilities/react/Tooltip";

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
	const clientUuid = useAuthStore((store) => store.clientUuid);
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
				onClick={(e) => {
					e.currentTarget.blur();

					if (relation === "Self" && currentScene !== "Game")
						setShowWindow("profile", true);
					else if (relation === "Bot")
						setShowWindow("bots", true);
					else
						setShowWindow("stats", true, uuid);
				}}
				// animate-glow
				className={`
					rounded-sm
					${ currentScene !== "Game" && "hover:not-disabled:scale-105 active:hover:not-disabled:scale-100 focus-visible:outline-2 cursor-pointer" }
					outline-b5
					relative h-min
					`}>
				<Tooltip text={relation === "Self" ? "Edit Profile" : "View Profile"}>
					<AvatarImage
						uuid={uuid}
						image={image ?? undefined}
						isActive={isActive}
					/>
				</Tooltip>
				<AvatarCornerButton cornerButton={cornerButton} />
			</button>
			{ showName && <AvatarName name={cachedData[uuid?? ""]?.name ?? "-"} /> }
		</div>
	);
}