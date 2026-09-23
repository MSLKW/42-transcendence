import { useAuthStore } from "../../../store/AuthStore";
import { useProfileStore } from "../../../store/ProfileStore";
import { useSettingsStore } from "../../../store/SettingsStore";

interface AvatarProps {
	uuid: string | undefined;
	image: string | undefined;
	isActive?: boolean;
	isChat?: boolean
}

export const AvatarImage = ({ uuid, image, isActive, isChat = false }: AvatarProps) => {
	const clientUuid = useAuthStore((store) => store.clientUuid);
	const autoPassIndex = useSettingsStore((store) => store.autoPassIndex);
	const avatarVersion = useProfileStore((store) => store.avatarVersions[uuid ?? ""] ?? 0);

	const autoPassOptions = [1, 3, 5, 10, 15, 30, 42, 60, 120, -1];
	const autoPassDuration = autoPassOptions[autoPassIndex];
	const imageSrc = image ? `${image}${image.includes("?") ? "&" : "?"}v=${avatarVersion}` : undefined;

	return (
		<div className={`
			${isChat ? "h-full w-full" : "h-6rem aspect-square"}
			border ${(uuid === clientUuid && image) ? "border-b4 bg-b5/40" : "border-n2 bg-n3/20"} rounded-sm
			flex place-content-center place-items-center
			relative
		`}>
			{ imageSrc &&
				<img
					src={imageSrc}
					alt="alt text"
					loading="lazy"
					className="h-full w-full"
				/>
			}
			{ isActive && autoPassDuration != -1 &&
				<div
					style={{ ["--wipe-duration" as any]: `${autoPassDuration}s` }}
					className="w-full h-full bg-b5 animate-turn-wipe"
				/>
			}
		</div>
	)
}