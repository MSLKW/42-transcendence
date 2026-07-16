import { useSettingsStore } from "../../store/SettingsStore";
import { HostIcon } from "../icon/Host";

interface AvatarProps {
	cornerButton?: string;
	isActive?: boolean;
}

export const AvatarImage = ({ cornerButton, isActive }: AvatarProps) => {
	const autoPassIndex = useSettingsStore((state) => state.autoPassIndex);
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
			{ cornerButton === "host" &&
				<div className="
					data-tip-up
					absolute top-0 right-0 translate-x-1/2 -translate-y-1/2
					z-1
					bg-n1
					border border-n2 rounded-2xl
					text-a4
					w-7.5 h-7.5
					flex place-content-center place-items-center
				">
					<HostIcon />
				</div>
			}
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