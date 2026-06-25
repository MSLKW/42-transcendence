import { ChatIcon } from "../icons/ChatIcon";

export const AvatarPlayer = () => {
	return (
		<div className="
			w-20 h-25
			relative
		">
			<div className="w-full h-full flex flex-col">
				<div className="
					bg-a5
					border border-a6
					rounded-t-lg
					flex-1
				">
				</div>
				<div className="
					bg-n1
					border border-n2
					rounded-b-lg
					text-sm text-n6 text-center
					py-1
				">
					Player
				</div>
			</div>
			<button
				data-tip="Chat"
				className="
					absolute top-0 right-0 translate-x-1/2 -translate-y-1/2
					btn-icon btn-tip-up
					bg-n1
					border border-n2
					rounded-3xl
				"
			>
				<ChatIcon />
			</button>
		</div>
	);
}