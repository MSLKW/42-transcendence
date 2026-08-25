import { useSettingsStore } from "../../../store/SettingsStore";

interface AvatarProps {
	isActive?: boolean;
}

export const AvatarImage = ({ isActive }: AvatarProps) => {
	const autoPassIndex = useSettingsStore((settingsStore) => settingsStore.autoPassIndex);
	const autoPassOptions = [1, 3, 5, 10, 15, 30, 42, 60, 120, -1];
	const autoPassDuration = autoPassOptions[autoPassIndex];

	return (
		<div className="
			w-[clamp(2.5rem,7.5vh+0.5rem,5rem)]
			aspect-square
			bg-a5
			border border-a6 rounded-sm
			flex place-content-center place-items-center
			relative
		">
			{ isActive && autoPassDuration != -1 &&
				<div
					style={{ ["--wipe-duration" as any]: `${autoPassDuration}s` }}
					className="w-full h-full bg-b5 animate-turn-wipe"
				/>
			}
		</div>
	)
}