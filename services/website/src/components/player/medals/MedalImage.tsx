import React from "react";

interface MedalImageProp {
	icon: React.ReactNode,
	title: string,
	date?: Date,
}

export const MedalImage = ({ icon, title, date }: MedalImageProp) => {
	const subtitle = date
		? `Unlocked at:\n${date.toString()}`
		: "Achievement Locked";

	return (
		<button
			data-tip-title={title}
			data-tip-subtitle={subtitle}
			type="button"
			aria-label={`${title}, ${subtitle}`}
			className={`
				h-12.5 aspect-square
				btn-icon ${date ? "bg-b4 border border-b5" : "bg-dark"} rounded-full
				data-tip-medal cursor-default
			`}
		>
			{icon}
		</button>
	);
}