import { YeahIcon, HmmmIcon, WoahIcon } from "../icons/EmojiIcons";

export const YeahButton = () => {
	return (
		<button data-tip="Yeah!"
			className="btn-icon btn-tip-down"
		>
			<YeahIcon />
		</button>
	);
}

export const HmmmButton = () => {
	return (
		<button data-tip="Hmmm..."
			className="btn-icon btn-tip-down"
		>
			<HmmmIcon />
		</button>
	);
}

export const WoahButton = () => {
	return (
		<button data-tip="~Woah~"
			className="btn-icon btn-tip-down"
		>
			<WoahIcon />
		</button>
	);
}