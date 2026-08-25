import { useSettingsStore } from "../../../store/SettingsStore";

interface AvatarProps {
	srcImg: string | undefined;
	isActive?: boolean;
}

export const AvatarImage = ({ srcImg, isActive }: AvatarProps) => {
	const autoPassIndex = useSettingsStore((settingsStore) => settingsStore.autoPassIndex);
	const autoPassOptions = [1, 3, 5, 10, 15, 30, 42, 60, 120, -1];
	const autoPassDuration = autoPassOptions[autoPassIndex];

	return (
		<div
			className="
				h-6rem aspect-square
				bg-n6/10
				border border-b4 rounded-sm
				flex place-content-center place-items-center
				relative
			"
		>
			{ srcImg &&
				<img
					src={srcImg}
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