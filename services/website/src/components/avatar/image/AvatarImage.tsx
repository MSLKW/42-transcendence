import { useAuthStore } from "../../../store/AuthStore";
import { useGameStore } from "../../../store/GameStore";
import { useProfileStore } from "../../../store/ProfileStore";

interface AvatarProps {
	uuid: string | undefined;
	image: string | undefined;
	isActive?: boolean;
	isDisconnected?: boolean;
	isChat?: boolean
}

export const AvatarImage = ({ uuid, image, isActive = false, isDisconnected = false, isChat = false, }: AvatarProps) => {
	const clientUuid = useAuthStore.getState().clientUuid;
	const avatarVersion = useProfileStore((store) => store.avatarVersions[uuid ?? ""] ?? 0);
	const playerTimer = useGameStore.getState().playerTimer;
	const playerRemainingTimer = useGameStore.getState().playerRemainingTimer;
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
			{ isActive && playerTimer != 0 &&
				<div
					style={{ 
						["--wipe-duration" as any]: `${playerTimer / 1000}s`,
						["--wipe-elapsed" as any]: `${(playerTimer - playerRemainingTimer) / 1000}s`
					}}
					className="w-full h-full bg-b5 opacity-50 animate-turn-wipe absolute"
				/>
			}
			{
				isDisconnected && <div className="w-full h-full bg-n0 opacity-50 absolute"/>
			}
		</div>
	)
}