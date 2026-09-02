import { chatSocket } from "../../../api/chat/chatSocket";
import { EmojiIcon } from "./EmojiIcon";

export const EmoteHover = () => {
	const handleSend = (e?: React.MouseEvent<HTMLButtonElement>) => {
		if (e)
			e.currentTarget.blur();
	}

	return (
		<button
			data-tip="Emote"
			onClick={(e) => {handleSend(e)}}
			className="
				btn-icon
				data-tip-left
			"
		>
			<EmojiIcon />
		</button>
	);
}

interface EmoteOptionsProps {
	emoji: string;
	tip: string;
}

export const EmoteOptions = ({ emoji, tip }: EmoteOptionsProps) => {
	const handleSend = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.currentTarget.blur();
		chatSocket.sendChat("EMOTE", emoji);
	}

	return (
		<button
			key={emoji}
			data-tip={tip}
			onClick={handleSend}
			className="
				text-3rem rounded-full
				h-12 aspect-square
				flex place-content-center place-items-center
				hover:outline outline-b5
				data-tip-down
			"
		>
			{emoji}
		</button>
	);
}

export const EmoteGroup = () => {
	return (
		<div className="group relative flex">
			<EmoteHover />
			<div
				className="
					bg-dark rounded-full
					h-max w-max
					p-8 pointer-events-auto
					absolute top-full left-1/2 -translate-x-1/2
					invisible opacity-0 group-hover:visible group-hover:opacity-100
					scale-0 group-hover:scale-100 origin-top
					transition-all duration-200 ease-in-out
					grid grid-cols-3 grid-rows-3
				"
			>
				<EmoteOptions emoji="😄" tip="~Happy~" />
				<EmoteOptions emoji="🥲" tip="~Sad~" />
				<EmoteOptions emoji="😎" tip="~Cool~" />
				<EmoteOptions emoji="😩" tip="~Weary~" />
				<EmoteOptions emoji="🥳" tip="~Celebrate~" />
				<EmoteOptions emoji="🫡" tip="~Respect~" />
				<EmoteOptions emoji="☠️" tip="~Dead~" />
				<EmoteOptions emoji="🔥" tip="~Too Hot~" />
				<EmoteOptions emoji="🚑" tip="~Send Help~" />
			</div>
		</div>
	)
}