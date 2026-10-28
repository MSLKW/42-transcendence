import type { ACHIEVEMENTS_TYPE } from "../../../store/StatsStore";
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
	achievements: Record<ACHIEVEMENTS_TYPE, Date>;
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
				title="'HIGH THERE'"
				description="Best your opponents with a high card"
				unlocked={achievements?.["best_single"] ?? undefined}
			/>
			<AchievementImage
				icon={<AchievementDoubleIcon />}
				title="'DOUBLE TAKE'"
				description="Best your opponents with a pair"
				unlocked={achievements?.["best_double"] ?? undefined}
			/>
			<AchievementImage
				icon={<AchievementTripleIcon />}
				title="'THIRD TIME'S A CHARM'"
				description="'Best your opponents with a triple"
				unlocked={achievements?.["best_triple"] ?? undefined}
			/>
			<AchievementImage
				icon={<AchievementStraightIcon />}
				title="'STRAIGHT TO THE TOP'"
				description="Best your opponents with a straight"
				unlocked={achievements?.["best_straight"] ?? undefined}
			/>
			<AchievementImage
				icon={<AchievementFlushIcon />}
				title="'SUIT YOURSELF'"
				description="Best your opponents with a flush"
				unlocked={achievements?.["best_flush"] ?? undefined}
			/>
			<AchievementImage
				icon={<AchievementFullHouseIcon />}
				title="'NO VACANCY'"
				description="Best your opponents with a full house"
				unlocked={achievements?.["best_full_house"] ?? undefined}
			/>
			<AchievementImage
				icon={<Achievement4OfAKindIcon />}
				title="'FOUR MIDABLE'"
				description="Best your opponents with a 4 of a kind"
				unlocked={achievements?.["best_four_of_a_kind"] ?? undefined}
			/>
			<AchievementImage
				icon={<AchievementStraightFlushIcon />}
				title="'FLUSH & FURIOUS'"
				description="Best your opponents with a straight flush"
				unlocked={achievements?.["best_straight_flush"] ?? undefined}
			/>
			<AchievementImage
				icon={<Achievement3OfDiamondsIcon />}
				title="'DIAMONDS ARE FOREVER"
				description="Play 3 of diamonds"
				unlocked={achievements?.["play_three_diamonds"] ?? undefined}
			/>
			<AchievementImage
				icon={<Achievement2OfSpadesIcon />}
				title="'BIG 2!'"
				description="Play 2 of spades"
				unlocked={achievements?.["play_two_spades"] ?? undefined}
			/>
			<AchievementImage
				icon={<AchievementNoPassIcon />}
				title="'I'LL PASS... WAIT, NO I WON'T'"
				description="Win a game without passing"
				unlocked={achievements?.["win_no_pass"] ?? undefined}
			/>
			<AchievementImage
				icon={<AchievementFirstWinIcon />}
				title="'DEAL WITH IT'"
				description="Win a game"
				unlocked={achievements?.["first_win"] ?? undefined}
			/>
		</div>
	);
}