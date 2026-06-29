import { ChatButton } from "./Chat"

interface AvatarProps {
	call?: (e: React.MouseEvent<HTMLButtonElement>) => void,
	showChatButton?: boolean;
	playerName?: string;
}

export const AvatarPlayer = ({ showChatButton, call, playerName = "Player" }: AvatarProps) => {
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

					{showChatButton &&
						<div className="
							absolute top-0 right-0 translate-x-1/2 -translate-y-1/2
							z-1
						">
							<ChatButton call={call}/>
						</div>
					}
				</div>
				{/* absolute -bottom-8 */}
				<div className="
					w-max min-w-[clamp(2.5rem,7.5vh+0.5rem,5rem)] max-w-32.5
					h-fit
					bg-n1
					border border-n2 rounded-lg
					text-[clamp(0.5rem,2vh+0.25rem,1rem)]
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