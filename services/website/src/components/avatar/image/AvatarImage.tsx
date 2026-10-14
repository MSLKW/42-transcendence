import { useAuthStore } from "../../../store/AuthStore";
import { useGameStore } from "../../../store/GameStore";
import { useProfileStore } from "../../../store/ProfileStore";
import { useSettingsStore } from "../../../store/SettingsStore";

interface AvatarProps {
	uuid: string | undefined;
	image: string | undefined;
	isActive?: boolean;
	isDisconnected?: boolean;
	isChat?: boolean
}

export const AvatarImage = ({ uuid, image, isActive, isDisconnected, isChat = false, }: AvatarProps) => {
	const clientUuid = useAuthStore.getState().clientUuid;
	// const autoPassIndex = useSettingsStore.getState().autoPassIndex;
	// const autoPassOptions = [1, 3, 5, 10, 15, 30, 42, 60, 120, -1];
	// const autoPassDuration = autoPassOptions[autoPassIndex];
	const avatarVersion = useProfileStore((store) => store.avatarVersions[uuid ?? ""] ?? 0);
	const autoPassDuration = useGameStore.getState().playerTimer;
	const imageSrc = image ? `${image}${image.includes("?") ? "&" : "?"}v=${avatarVersion}` : undefined;

	return (
		<div className={`
			${isChat ? "h-full w-full" : "h-6rem aspect-square"}
			flex place-content-center place-items-center
			relative rounded-sm
			border ${(uuid === clientUuid && image) ? "border-b4 bg-b5/40" : "border-n2 bg-n3/20"}
		`}>
			{ imageSrc &&
				<img
					src={imageSrc}
					alt="alt text"
					loading="lazy"
					className="h-full w-full rounded-sm"
				/>
			}
			{ isActive && autoPassDuration != 0 &&
				<div
					style={{ ["--wipe-duration" as any]: `${autoPassDuration / 1000}s` }}
					className="w-full h-full bg-b5 opacity-50 animate-turn-wipe absolute"
				/>
			}
			{
				isDisconnected && <div className="w-full h-full bg-n0 opacity-50 absolute"/>
			}
		</div>
	)
}