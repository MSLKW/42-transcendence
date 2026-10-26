import { useAuthStore } from "../../../store/AuthStore";
import type { AVAILABILITY_TYPE } from "../../../store/PartyStore";
import type { BADGE_TYPE } from "../../../store/ProfileStore";
import { useSceneStore } from "../../../store/SceneStore";
import { BadgeWindow } from "./badge/BadgeWindow";
import { PlayerStatusModule } from "../status/PlayerStatusModule";

interface PlayerDataModuleProps {
	uuid: string;
	badge: BADGE_TYPE | null;
	availability: AVAILABILITY_TYPE | null;
	lastOnline: Date | null;
	createdAt: Date | null;
	setBadge?: (badge: BADGE_TYPE) => void;
	setHasChange?: (change: boolean) => void;
	currentLevel: number;
	currentLevelXpEarned: number;
	currentLevelXpThreshold: number;
	currentLevelProgressPercentage: number;
}

export const PlayerDataModule = ({
	uuid,
	badge,
	availability,
	lastOnline,
	createdAt,
	setBadge,
	setHasChange,
	currentLevel,
	currentLevelXpEarned,
	currentLevelXpThreshold,
	currentLevelProgressPercentage,
}: PlayerDataModuleProps) => {
	const clientUuid = useAuthStore((store) => store.clientUuid);
	const showWindow = useSceneStore((store) => store.showWindow);
	const setShowWindow = useSceneStore((store) => store.setShowWindow);

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
				<h2>Level {currentLevel}</h2>
				<div className="w-full">
					<p className="text-center">
						XP: {currentLevelXpEarned} / {currentLevelXpThreshold}
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
								onClick={() => setShowWindow("badge", true)}
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
									<p className="px-3">{badge}</p>
									<span className="text-xs">▼</span>
								</span>
							</button>
						:
							<h2 className="w-full leading-none">
								<i>{badge ?? "n/a"}</i>
							</h2>
					}
					{ showWindow["badge"] &&
						<BadgeWindow
							badge={badge ?? "Newcomer"}
							setBadge={setBadge ?? (() => {})}
							setHasChange={setHasChange ?? (() => {})}
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