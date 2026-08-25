import { useProfileStore } from "../../../store/ProfileStore";
import { useSettingsStore } from "../../../store/SettingsStore";

interface AvatarProps {
	uuid: string | undefined;
	image: string | undefined;
	isActive?: boolean;
}

export const AvatarImage = ({ uuid, image, isActive }: AvatarProps) => {
	const clientUuid = useProfileStore.getState().clientUuid;
	const autoPassIndex = useSettingsStore.getState().autoPassIndex;
	const autoPassOptions = [1, 3, 5, 10, 15, 30, 42, 60, 120, -1];
	const autoPassDuration = autoPassOptions[autoPassIndex];

	return (
		<div
			className={`
				h-6rem aspect-square
				bg-n6/10
				border ${uuid === clientUuid ? "border-b4" : "border-a4"} rounded-sm
				flex place-content-center place-items-center
				relative
			`}
		>
			{ image &&
				<img
					src={image}
					alt="alt text"
					loading="lazy"
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