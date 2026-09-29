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
		">
			<EmojiIcon />
		</button>
	);
}