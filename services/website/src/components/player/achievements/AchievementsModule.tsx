import { type AchievementId, ACHIEVEMENT_NAMES, ACHIEVEMENT_HINTS, ACHIEVEMENT_IDS } from "../../../store/GameStatsStore";
import { AchievementImage } from "./AchievementImage";

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
			{ACHIEVEMENT_IDS.map((achievement) => {
				return (
					<AchievementImage
						key={achievement}
						title={ACHIEVEMENT_NAMES[achievement]}
						description={ACHIEVEMENT_HINTS[achievement]}
						unlocked={achievements?.[achievement] ?? undefined}
					/>
				);
			})}
		</div>
	);
}