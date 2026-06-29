import { ChatButton } from "./Chat"

interface AvatarProps {
	call?: (e: React.MouseEvent<HTMLButtonElement>) => void,
	showChatButton?: boolean;
	playerName?: string;
}

export const AvatarPlayer = ({ showChatButton, call, playerName = "Player" }: AvatarProps) => {
	return (
		<div className="btn-avatar">
			<div className="flex flex-col gap-[clamp(0.25rem,1.5vh+0.125rem,1rem)] place-items-center">
				<div className="
					w-full h-20
					bg-a5
					border border-a6 rounded-lg
					flex place-content-center place-items-center
				">
					X
				</div>
				<div className="
					truncate
					w-max min-w-20 max-w-32.5
					h-6.5
					bg-n1
					border border-n2 rounded-lg
					text-base
					text-n6
					flex place-content-center place-items-center
					px-5
				">
					<p>{playerName}</p>
				</div>
			</div>
			{showChatButton &&
				<div className="
					absolute top-0 right-0 translate-x-1/2 -translate-y-1/2
					z-1
				">
					<ChatButton call={call}/>
				</div>
			}
		</div>
	);
}