import { useGameStore } from "../../store/GameStore";
import { usePartyStore } from "../../store/PartyStore";

interface AvatarProps {
	playerIndex?: number;
}

export const AvatarName = ({ playerIndex = 0 }: AvatarProps) => {
	const { playerOrder } = useGameStore();
	const { members } = usePartyStore();

	return (
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
			{ playerIndex >= 0
				? <p>{members[playerIndex].name}</p>
				: <p>{playerOrder[playerIndex]}</p>
			}
		</div>
	);
}