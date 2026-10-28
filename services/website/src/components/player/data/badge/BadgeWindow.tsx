import { handlePublicPlayerGameData } from "../../../../api/gameStats/get_public-player-game-data/handlePublicPlayerGameData";
import { handleDisplayedBadge } from "../../../../api/gameStats/put_displayed-badge/handleDisplayedBadge";
import { type PublicBadgeId, BADGE_NAMES, BADGE_HINTS } from "../../../../store/GameStatsStore";
import { useSceneStore } from "../../../../store/SceneStore";
import { Tooltip } from "../../../../utilities/react/Tooltip";
import { LightboxButton } from "../../../lightbox/LightboxButton";

interface BadgeWindowProps {
	badge: PublicBadgeId;
	availableBadges: Record<PublicBadgeId, boolean> | undefined;
	setBadge: (type: PublicBadgeId) => void;
	setHasChange: (change: boolean) => void;
}

export const BadgeWindow = ({ badge, availableBadges, setBadge, setHasChange }: BadgeWindowProps) => {
	const showWindow = useSceneStore((store) => store.showWindow);

	return (
		<>
			{ showWindow["badge"] && 
				<div className="fixed z-10 left-0 top-0 h-screen w-screen">
					<LightboxButton dismiss="badge" blur={false} />
				</div>
			}
			<menu className="
				absolute z-50 top-[110%] w-full
				bg-dark rounded-md
				text-n2
				flex flex-col place-content-center place-items-center
				py-0.5rem
			">
				{ availableBadges &&
					Object.keys(availableBadges).map((b) => {
						const key = b as keyof typeof availableBadges;
						const isUnlocked = availableBadges[key];

						return (
							<li key={b}>
								<Tooltip text={BADGE_HINTS[key]}>
									<button
										type="button"
										disabled={!isUnlocked}
										onClick={() => {
											setBadge(b as PublicBadgeId);
											handleDisplayedBadge(b);
											useSceneStore.getState().setShowWindow("badge", false);
											setHasChange(true);
										}}
										className={`
											w-full
											hover:not-disabled:bg-n2
											rounded-full
											text-sm
											${b === badge ? "text-b5" : "text-n6"}
											py-0.5rem px-2rem
											cursor-pointer
									`}>
										{BADGE_NAMES[key]}
									</button>
								</Tooltip>
							</li>
						)
					})
				}
			</menu>
		</>
	);
}