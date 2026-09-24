import { useGameStore } from "../store/useGameStore";
import { useSceneStore } from "../store/useSceneStore";
import { usePlayerStore } from "../store/usePlayerStore";

interface AvatarProps {
	cornerButton?: string;
	playerIndex?: number;
	isActive?: boolean;
	role?: string;
}

export const AvatarImage = ({ cornerButton, isActive }: AvatarProps) => {
	const autoPassIndex = useGameStore((state) => state.autoPassIndex);
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
			{cornerButton === "cardsLeft" &&
				<div className="
					absolute top-0 right-0 translate-x-1/2 -translate-y-1/2
					z-1
					bg-n1
					border border-n2 rounded-2xl
					text-sm
					text-n6
					w-7.5 h-7.5
					flex place-content-center place-items-center
				">
					<p>13</p>
				</div>
			}
			{cornerButton === "1st" &&
				<div className="
					absolute top-0 right-0 translate-x-1/2 -translate-y-1/2
					z-1
					bg-b5
					border border-b6 rounded-full
					text-sm text-n0
					w-10 h-10
					flex place-content-center place-items-center
				">
					<p>1st</p>
				</div>
			}
			{ (cornerButton === "2nd" || cornerButton === "3rd" || cornerButton === "4th") &&
				<div className="
					absolute top-0 right-0 translate-x-1/2 -translate-y-1/2
					z-1
					bg-n1
					border border-n2 rounded-full
					text-sm text-n6
					w-10 h-10
					flex place-content-center place-items-center
				">
					<p>{cornerButton}</p>
				</div>
			}
			{isActive && autoPassDuration != -1 &&
				<div
					style={{ ["--wipe-duration" as any]: `${autoPassDuration}s` }}
					className="w-full h-full bg-b5 animate-turn-wipe"
				/>
			}
		</div>
	)
}

export const AvatarButton = ({ cornerButton = "none", playerIndex = 0, isActive = false, role = "opponent" }: AvatarProps) => {
	const setShowWindow = useSceneStore((state) => state.setShowWindow);
	const playerList = useGameStore((state) => state.playerList);
	const setPlayerIndex = usePlayerStore((state) => state.setPlayerIndex);

	return (
		<>
			<button
				data-tip={ role === "self" ? "Edit Profile" : "View Stats"}
				onClick={(e) => {
					if (role === "self")
						setShowWindow("profile", true);
					else {
						setPlayerIndex(playerIndex);
						setShowWindow("stats", true);
					}
					e.currentTarget.blur();
				}}
				className="
					btn-avatar btn-tip-up h-max w-max
					flex flex-col place-content-center place-items-center
					gap-1
			">
				<AvatarImage cornerButton={cornerButton} isActive={isActive} />
				<div className="
					w-max min-w-[clamp(2.5rem,7.5vh+0.5rem,5rem)] max-w-32.5
					h-fit
					bg-n1
					border border-n2 rounded-3xl
					text-[clamp(0.25rem,1.5vh+0.125rem,1rem)]
					text-n6
					truncate
					flex place-content-center place-items-center
					px-[clamp(0.625rem,1vh+0.3125rem,1.25rem)]
				">
					<p>{playerList[playerIndex]}</p>
				</div>
			</button>
		</>
	);
}