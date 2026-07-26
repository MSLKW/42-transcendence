import { YeahIcon, HmmmIcon, WoahIcon } from "../icon/Emoji";

export const YeahButton = () => {
	const handleSend = (e?: React.MouseEvent<HTMLButtonElement>) => {
		if (e)
			e.currentTarget.blur();
	}

	return (
		<button data-tip="Yeah!"
			onClick={(e) => {handleSend(e)}}
			className="
				btn-icon
				btn-tip-left
			"
		>
			<YeahIcon />
		</button>
	);
}

export const HmmmButton = () => {
	const handleSend = (e?: React.MouseEvent<HTMLButtonElement>) => {
		if (e)
			e.currentTarget.blur();
	}

	return (
		<button data-tip="Hmmm..."
			onClick={(e) => {handleSend(e)}}
			className="
				btn-icon
				btn-tip-left
			"
		>
			<HmmmIcon />
		</button>
	);
}

export const WoahButton = () => {
	const handleSend = (e?: React.MouseEvent<HTMLButtonElement>) => {
		if (e)
			e.currentTarget.blur();
	}

	return (
		<button data-tip="~Woah~"
			onClick={(e) => {handleSend(e)}}
			className="
				btn-icon
				btn-tip-left
			"
		>
			<WoahIcon />
		</button>
	);
}

export const EmojiButton = () => {
	return (
		<div className="group relative flex gap-5">
			<YeahButton />
			<div className="
				absolute
				invisible opacity-0 group-hover:visible group-hover:opacity-100
				transition-all duration-200 ease-in-out transform group-hover-105
				flex flex-col gap-2
				btn-icon-border h-fit
			">
				<YeahButton />
				<HmmmButton />
				<WoahButton />
			</div>
		</div>
	)
}