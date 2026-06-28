import { ChatButton } from "./Chat"

interface AvatarProps {
	call?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	showChatButton?: boolean,
}

export const AvatarPlayer = ({ showChatButton, call }: AvatarProps) => {
	return (
		<div className="btn-avatar">
			<div className="
				w-full h-4/5
				bg-a5
				border border-a6 rounded-t-lg
				flex place-content-center place-items-center
			">
				X
			</div>
			<div className="
				w-full h-1/5
				bg-n1
				border border-n2 rounded-b-lg
				text-base
				text-n6
				flex place-content-center place-items-center
			">
				<p>Player</p>
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