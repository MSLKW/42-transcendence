interface AvatarProps {
	call?: (e: React.MouseEvent<HTMLButtonElement>) => void,
	cornerButton?: string;
	playerName?: string;
	activePlayer?: number;
}

export const AvatarImage = ({ cornerButton, activePlayer }: AvatarProps) => {
	// const isActive = activePlayer === index;
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
			<div
				// key={animationKey}
				className="w-full h-full bg-b5 animate-turn-wipe"
			/>
		</div>
	)
}

export const AvatarPlayer = ({ cornerButton = "none", playerName = "Player", activePlayer = -1 }: AvatarProps) => {
	return (
		<>
			<div className="
				flex flex-col place-items-center
				gap-1
			">
				<AvatarImage cornerButton={cornerButton} activePlayer={activePlayer} />
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
					<p>{playerName}</p>
				</div>
			</div>
		</>
	);
}