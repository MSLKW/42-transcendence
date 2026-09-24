import { YeahIcon, HmmmIcon, WoahIcon } from "../icons/EmojiIcons";

export const YeahButton = () => {
	const handleSend = (e?: React.MouseEvent<HTMLButtonElement>) => {
		if (e)
			e.currentTarget.blur();
	}

	return (
		<button data-tip="Yeah!"
			onClick={(e) => {handleSend(e)}}
<<<<<<<< HEAD:services/website/src/components/EmojiButtons.tsx
			className="btn-emoji btn-tip-left"
========
			className="
				btn-icon
				data-tip-left
			"
>>>>>>>> origin/int/KAN-36-website-db:services/website/src/components/button/Emoji.tsx
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
<<<<<<<< HEAD:services/website/src/components/EmojiButtons.tsx
			className="btn-emoji btn-tip-left"
========
			className="
				btn-icon
				data-tip-left
			"
>>>>>>>> origin/int/KAN-36-website-db:services/website/src/components/button/Emoji.tsx
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
<<<<<<<< HEAD:services/website/src/components/EmojiButtons.tsx
			className="btn-emoji btn-tip-left"
========
			className="
				btn-icon
				data-tip-left
			"
>>>>>>>> origin/int/KAN-36-website-db:services/website/src/components/button/Emoji.tsx
		>
			<WoahIcon />
		</button>
	);
}

export const EmojiButton = () => {
	return (
		<div className="group relative flex gap-5">
<<<<<<<< HEAD:services/website/src/components/EmojiButtons.tsx
			<button className="btn-icon">
				<YeahIcon />
			</button>
			<div className="
				absolute
				invisible opacity-0 group-hover:visible group-hover:opacity-100
				transition-all duration-200 ease-in-out transform group-hover-105
				flex flex-col gap-2
				btn-icon-border h-fit
			">
========
			<YeahButton />
			<div
				className="
					btn-icon bg-dark
					absolute
					invisible opacity-0 group-hover:visible group-hover:opacity-100
					transition-all duration-200 ease-in-out transform group-hover-105
					flex flex-col gap-2
				"
			>
>>>>>>>> origin/int/KAN-36-website-db:services/website/src/components/button/Emoji.tsx
				<YeahButton />
				<HmmmButton />
				<WoahButton />
			</div>
		</div>
	)
}