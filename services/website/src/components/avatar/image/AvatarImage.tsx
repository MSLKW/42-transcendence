import { useAuthStore } from "../../../store/AuthStore";
import { useSettingsStore } from "../../../store/SettingsStore";
import { useGameStore } from "../../../store/GameStore";

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
	const autoPassDuration = useGameStore.getState().playerTimer;

	return (
		<div
			className={`
				${isChat ? "h-full w-full" : "h-6rem aspect-square"}
				border ${(uuid === clientUuid && image) ? "border-b4 bg-b5/40" : "border-n2 bg-n3/20"} rounded-sm
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