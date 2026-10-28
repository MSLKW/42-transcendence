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
		? `Unlocked at:\n${unlockedDate.toLocaleString()}`
		: "Achievement Locked";

	return (
		<AchievementTooltip text={title} description={description} date={subtitle}>
			<button
				type="button"
				aria-label={`${title}, ${subtitle}`}
				className={`
					h-12.5 aspect-square
					btn-icon rounded-full bg-radial border
					${unlocked ? "from-b4 to-b2 border-b5 text-b5" : "from-a4 to-a2 border-a5 opacity-60"}
					cursor-help
			`}>
				{icon}
			</button>
		</AchievementTooltip>
	);
}