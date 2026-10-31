import { useAuthStore } from "../../../store/AuthStore";
import type { AVAILABILITY_TYPE } from "../../../store/PartyStore";
import { type PublicBadgeId, BADGE_NAMES } from "../../../store/GameStatsStore";
import { useSceneStore } from "../../../store/SceneStore";
import { BadgeWindow } from "./badge/BadgeWindow";
import { PlayerStatusModule } from "../status/PlayerStatusModule";

interface PlayerDataModuleProps {
	uuid: string;
	availability: AVAILABILITY_TYPE | null;
	lastOnline: Date | null;
	createdAt: Date | null;
	xp: number;
	level: number;
	currentLevelXpThreshold: number;
	currentLevelProgressPercentage: number;
	displayedBadgeId: PublicBadgeId | null;
	availableBadges?: Record<PublicBadgeId, boolean>;
	setBadge?: (badge: PublicBadgeId) => void;
	setHasChange?: (change: boolean) => void;
}

export const PlayerDataModule = ({
	uuid,
	availability,
	lastOnline,
	createdAt,
	xp,
	level,
	currentLevelXpThreshold,
	currentLevelProgressPercentage,
	displayedBadgeId,
	availableBadges,
	setBadge,
	setHasChange,
}: PlayerDataModuleProps) => {
	const clientUuid = useAuthStore((store) => store.clientUuid);
	const showWindow = useSceneStore((store) => store.showWindow);

	return (
		<div className="
			w-full
			space-y-4
			p-5
			text-n6
		">
			<div className="
				grid grid-cols-[5rem_1fr]
				gap-2rem
				place-items-center
				leading-tight
			">
				<h2>Level {xp}</h2>
				<div className="w-full">
					<p className="text-center">
						XP: {level} / {currentLevelXpThreshold}
					</p>
					<div className="
						h-2
						rounded-full
						bg-a0
						border border-b5 self-center
						mt-1
					">
						<div 
							style={{ width: `${currentLevelProgressPercentage}%` }}
							className="
								bg-b5 
								h-full rounded-full
						"/>
					</div>
				</div>
			</div>
			<div className="
				w-full
				flex place-content-between place-items-center
				gap-2rem
			">
				<div className="relative w-full flex">
					{ uuid === clientUuid
						?
							<button
								type="button"
								onClick={() => useSceneStore.getState().setShowWindow("badge", true)}
								className="
									w-full
									bg-n6
									border border-n5 rounded-full
									text-sm
									self-center
									cursor-pointer
							">
								<span className="
									text-n0
									pl-1 pr-3 py-1
									flex justify-between items-center
								">
									<p className="px-3">{displayedBadgeId ? BADGE_NAMES[displayedBadgeId] : "n/a"}</p>
									<span className="text-xs">▼</span>
								</span>
							</button>
						:
							<h3 className="w-full leading-none">
								<i>{displayedBadgeId ? BADGE_NAMES[displayedBadgeId] : "n/a"}</i>
							</h3>
					}
					{ showWindow["badge"] &&
						<BadgeWindow
							badge={displayedBadgeId ?? "fresh_deal"}
							setBadge={setBadge ?? (() => {})}
							setHasChange={setHasChange ?? (() => {})}
							availableBadges={availableBadges ?? ({} as Record<PublicBadgeId, boolean>)}
						/>
					}
				</div>
				<PlayerStatusModule
					uuid={uuid}
					availability={availability}
					lastOnline={lastOnline}
				/>
			</div>
			<div className="text-a5">
				<p>UUID: {uuid}</p>
				<p>Joined: {createdAt?.toString() ?? "n/a"}</p>
			</div>
		</div>
	);
}