import { useProfileStore } from "../../store/ProfileStore";
import { useSceneStore } from "../../store/SceneStore";
import { AvatarImage } from "./image/AvatarImage";
import { AvatarName } from "./name/AvatarName";
import { AvatarCornerButton } from "./corner/AvatarCornerButton";
import { ChatBubbles } from "../bubble/ChatBubble";
import { Tooltip } from "../../utilities/react/Tooltip";
import { useGameStore } from "../../store/GameStore";

interface AvatarModuleProps {
	uuid: string;
	image: string | undefined;
	cornerButton?: string | number;
	isActive?: boolean;
	isDisconnected?: boolean;
	showName?: boolean;
}

export const AvatarModule = ({
	uuid,
	image,
	cornerButton = "",
	isActive = false,
	isDisconnected = false,
	showName = true,
}: AvatarModuleProps) => {
	const cachedProfiles = useProfileStore((store) => store.cachedProfiles);
	const currentScene = useSceneStore((store) => store.currentScene);
	const playerPassed = useGameStore((store) => store.playerPassed);

	const relation = cachedProfiles[uuid ?? ""]?.relation ?? null;

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

					if (currentScene === "Game" || relation === "Bot")
						return;

					if (relation === "Self")
						useSceneStore.getState().setShowWindow("profile", true);
					else
						useSceneStore.getState().setShowWindow("stats", true, uuid);
				}}
				className={`
					rounded-sm
					${ (currentScene !== "Game" && relation !== "Bot") && "hover:not-disabled:scale-105 active:hover:not-disabled:scale-100 focus-visible:outline-2 cursor-pointer" }
					outline-b5
					relative h-min
					${ currentScene === "Game" && isActive === true && "animate-glow"}
				`}>
				<Tooltip text={
					relation === "Self" ? "Edit Profile" :
					relation === "Bot" ? null : 
					"View Profile"
				}>
					<AvatarImage
						uuid={uuid}
						image={image ?? undefined}
						isActive={isActive}
						isDisconnected={isDisconnected}
					/>
				</Tooltip>
				<AvatarCornerButton cornerButton={cornerButton} />
				{ playerPassed.includes(uuid) &&
					<div className="
						absolute bottom-0 translate-y-2 left-1/2 -translate-x-1/2
						bg-n1/80 text-n6 border border-n2
						w-[120%] rounded-full
					">
						<p>PASSED</p>
					</div>
				}
			</button>
			{ showName && <AvatarName name={cachedProfiles[uuid?? ""]?.name ?? "-"} /> }
		</div>
	);
}