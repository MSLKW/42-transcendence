import React from "react";
import { AchievementTooltip } from "../../../utilities/react/AchievementTooltip";

interface AchievementImageProp {
	icon: React.ReactNode,
	title: string,
	description: string,
	unlocked: Date | undefined,
}

export const AchievementImage = ({ icon, title, description, unlocked }: AchievementImageProp) => {
	const unlockedDate = unlocked ? new Date(unlocked) : null;

	const subtitle = unlockedDate
		? `Unlocked at:\n${unlockedDate.toString()}`
		: "Achievement Locked";

	return (
		<AchievementTooltip text={title} description={description} date={subtitle}>
			<button
				type="button"
				aria-label={`${title}, ${subtitle}`}
				className={`
					h-12.5 aspect-square
					btn-icon ${unlocked ? "bg-b4 border border-b5" : "bg-dark-semi"} rounded-full
					cursor-default
			`}>
				{icon}
			</button>
		</AchievementTooltip>
	);
}