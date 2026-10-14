import React from "react";
import { MedalTooltip } from "../../../utilities/react/MedalTooltip";

interface MedalImageProp {
	icon: React.ReactNode,
	title: string,
	description: string,
	date?: Date,
}

export const MedalImage = ({ icon, title, description, date }: MedalImageProp) => {
	const subtitle = date
		? `Unlocked at:\n${date.toString()}`
		: "Achievement Locked";

	return (
		<MedalTooltip text={title} description={description} date={subtitle}>
			<button
				type="button"
				aria-label={`${title}, ${subtitle}`}
				className={`
					h-12.5 aspect-square
					btn-icon ${date ? "bg-b4 border border-b5" : "bg-dark-semi"} rounded-full
					cursor-default
			`}>
				{icon}
			</button>
		</MedalTooltip>
	);
}