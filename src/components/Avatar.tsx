import { ChatButton } from "./Chat"

interface AvatarProps {
	call?: (e: React.MouseEvent<HTMLButtonElement>) => void,
	cornerButton?: string;
	playerName?: string;
}

export const AvatarPlayer = ({ cornerButton, call, playerName = "Player" }: AvatarProps) => {
	return (
		<>
			<div className="
				flex flex-col place-items-center
				gap-1
				relative
			">
				<div className="
					h-[clamp(2.5rem,7.5vh+0.5rem,5rem)]
					aspect-square
					bg-a5
					border border-a6 rounded-lg
					flex place-content-center place-items-center
					relative
				">
					{cornerButton === "chat" &&
						<div className="
							absolute top-0 right-0 translate-x-1/2 sm:-translate-y-1/2
							z-1
						">
							<ChatButton call={call}/>
						</div>
					}
					{cornerButton === "cards" &&
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
				</div>
				<div className="
					w-max min-w-[clamp(2.5rem,7.5vh+0.5rem,5rem)] max-w-32.5
					h-fit
					bg-n1
					border border-n2 rounded-lg
					text-[clamp(0.25rem,1.5vh+0.125rem,1rem)]
					text-n6
					truncate
					flex place-content-center place-items-center
					px-[clamp(0.625rem,1vh+0.3125rem,1.25rem)]
				">
					<p>{playerName}</p>
				</div>
			</div>
		</>
	);
}