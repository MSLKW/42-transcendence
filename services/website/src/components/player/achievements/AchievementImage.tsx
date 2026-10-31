import { AchievementTooltip } from "../../../utilities/react/AchievementTooltip";
import { AchievementDoubleIcon } from "./icons/AchievementDoubleIcon";
import { AchievementTripleIcon } from "./icons/AchievementTripleIcon";
import { AchievementStraightIcon } from "./icons/AchievementStraight";
import { AchievementFlushIcon } from "./icons/AchievementFlushIcon";
import { Achievement4OfAKindIcon } from "./icons/Achievement4OfAKind";
import { AchievementFullHouseIcon } from "./icons/AchievementFullHouseIcon";
import { AchievementStraightFlushIcon } from "./icons/AchievementStraightFlush";
import { AchievementFirstWinIcon } from "./icons/AchievementFirstWin";
import { Achievement3OfDiamondsIcon } from "./icons/Achievement3OfDiamondsHand";
import { Achievement2OfSpadesIcon } from "./icons/Achievement2OfSpadesIcon";
import { AchievementNoPassIcon } from "./icons/AchievementNoPassIcon";
import { AchievementHighIcon } from "./icons/AchievementHighIcon";

interface AchievementImageProp {
	title: string,
	description: string,
	unlocked: Date | undefined,
}

export const AchievementImage = ({ title, description, unlocked }: AchievementImageProp) => {
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
				{
					title === "High" ? <AchievementHighIcon /> :
					title === "Double" ? <AchievementDoubleIcon /> :
					title === "Triple" ? <AchievementTripleIcon /> :
					title === "Straight" ? <AchievementStraightIcon /> :
					title === "Flush" ? <AchievementFlushIcon /> :
					title === "Full House" ? <AchievementFullHouseIcon /> :
					title === "4 Of A Kind" ? <Achievement4OfAKindIcon /> :
					title === "Straight Flush" ? <AchievementStraightFlushIcon /> :
					title === "3 Of Diamonds" ? <Achievement3OfDiamondsIcon /> :
					title === "2 Of Spades" ? <Achievement2OfSpadesIcon /> :
					title === "No Pass" ? <AchievementNoPassIcon /> :
					<AchievementFirstWinIcon />
				}
			</button>
		</AchievementTooltip>
	);
}