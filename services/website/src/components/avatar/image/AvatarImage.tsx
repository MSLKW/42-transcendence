import { useProfileStore } from "../../../store/ProfileStore";
import { useSettingsStore } from "../../../store/SettingsStore";

interface AvatarProps {
	uuid: string | undefined;
	image: string | undefined;
	isActive?: boolean;
	isChat?: boolean
}

export const AvatarImage = ({ uuid, image, isActive, isChat = false }: AvatarProps) => {
	const autoPassIndex = useSettingsStore((store) => store.autoPassIndex);
	const avatarVersion = useProfileStore((store) => store.avatarVersions[uuid ?? ""] ?? 0);

	const autoPassOptions = [1, 3, 5, 10, 15, 30, 42, 60, 120, -1];
	const autoPassDuration = autoPassOptions[autoPassIndex];
	const imageSrc = image ? `${image}${image.includes("?") ? "&" : "?"}v=${avatarVersion}` : undefined;

	return (
		<div className={`
			${isChat ? "h-full w-full" : "h-6rem aspect-square"}
			flex place-content-center place-items-center
			relative rounded-sm border border-n2
		`}>
			{ imageSrc &&
				<img
					src={imageSrc}
					alt="alt text"
					loading="lazy"
					className="h-full w-full rounded-sm"
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