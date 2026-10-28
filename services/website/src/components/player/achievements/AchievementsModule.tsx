import { type AchievementId, ACHIEVEMENT_NAMES, ACHIEVEMENT_HINTS } from "../../../store/StatsStore";
import { AchievementImage } from "./AchievementImage";
import { AchievementHighIcon } from "./icons/AchievementHighIcon";
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

interface AchievementsModuleProps {
	achievements: Record<AchievementId, Date> | undefined;
}
export const AchievementsModule = ({ achievements }: AchievementsModuleProps) => {
	return (
		<div
			className="
				grid grid-cols-6 grid-rows-2
				place-content-center place-items-center
				gap-5 py-1rem px-5rem relative
		">
			<AchievementImage
				icon={<AchievementHighIcon />}
				title={ACHIEVEMENT_NAMES["best_single"]}
				description={ACHIEVEMENT_HINTS["best_single"]}
				unlocked={achievements?.["best_single"] ?? undefined}
			/>
			<AchievementImage
				icon={<AchievementDoubleIcon />}
				title={ACHIEVEMENT_NAMES["best_double"]}
				description={ACHIEVEMENT_HINTS["best_double"]}
				unlocked={achievements?.["best_double"] ?? undefined}
			/>
			<AchievementImage
				icon={<AchievementTripleIcon />}
				title={ACHIEVEMENT_NAMES["best_triple"]}
				description={ACHIEVEMENT_HINTS["best_triple"]}
				unlocked={achievements?.["best_triple"] ?? undefined}
			/>
			<AchievementImage
				icon={<AchievementStraightIcon />}
				title={ACHIEVEMENT_NAMES["best_straight"]}
				description={ACHIEVEMENT_HINTS["best_straight"]}
				unlocked={achievements?.["best_straight"] ?? undefined}
			/>
			<AchievementImage
				icon={<AchievementFlushIcon />}
				title={ACHIEVEMENT_NAMES["best_flush"]}
				description={ACHIEVEMENT_HINTS["best_flush"]}
				unlocked={achievements?.["best_flush"] ?? undefined}
			/>
			<AchievementImage
				icon={<AchievementFullHouseIcon />}
				title={ACHIEVEMENT_NAMES["best_full_house"]}
				description={ACHIEVEMENT_HINTS["best_full_house"]}
				unlocked={achievements?.["best_full_house"] ?? undefined}
			/>
			<AchievementImage
				icon={<Achievement4OfAKindIcon />}
				title={ACHIEVEMENT_NAMES["best_four_of_a_kind"]}
				description={ACHIEVEMENT_HINTS["best_four_of_a_kind"]}
				unlocked={achievements?.["best_four_of_a_kind"] ?? undefined}
			/>
			<AchievementImage
				icon={<AchievementStraightFlushIcon />}
				title={ACHIEVEMENT_NAMES["best_straight_flush"]}
				description={ACHIEVEMENT_HINTS["best_straight_flush"]}
				unlocked={achievements?.["best_straight_flush"] ?? undefined}
			/>
			<AchievementImage
				icon={<Achievement3OfDiamondsIcon />}
				title={ACHIEVEMENT_NAMES["play_three_diamonds"]}
				description={ACHIEVEMENT_HINTS["play_three_diamonds"]}
				unlocked={achievements?.["play_three_diamonds"] ?? undefined}
			/>
			<AchievementImage
				icon={<Achievement2OfSpadesIcon />}
				title={ACHIEVEMENT_NAMES["play_two_spades"]}
				description={ACHIEVEMENT_HINTS["play_two_spades"]}
				unlocked={achievements?.["play_two_spades"] ?? undefined}
			/>
			<AchievementImage
				icon={<AchievementNoPassIcon />}
				title={ACHIEVEMENT_NAMES["win_no_pass"]}
				description={ACHIEVEMENT_HINTS["win_no_pass"]}
				unlocked={achievements?.["win_no_pass"] ?? undefined}
			/>
			<AchievementImage
				icon={<AchievementFirstWinIcon />}
				title={ACHIEVEMENT_NAMES["first_win"]}
				description={ACHIEVEMENT_HINTS["first_win"]}
				unlocked={achievements?.["first_win"] ?? undefined}
			/>
		</div>
	);
}