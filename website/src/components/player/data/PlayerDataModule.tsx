import { useState, useEffect } from "react";
import { handleCreatedAt } from "../../../api/authentication/created_at/handleCreatedAt";
import { handleGetProfile } from "../../../api/profile/get_profile/handleGetProfile";
import { useAuthStore } from "../../../store/AuthStore";
import type { BADGE_TYPE } from "../../../store/ProfileStore";
import { useSceneStore } from "../../../store/SceneStore";
import { BadgeWindow } from "./badge/BadgeWindow";
import { PlayerStatusModule } from "../status/PlayerStatusModule";

interface PlayerDataModuleProps {
	uuid: string | null;
	badge?: BADGE_TYPE | null;
	setBadge?: (badge: BADGE_TYPE) => void;
}

export const PlayerDataModule = ({ uuid, badge, setBadge }: PlayerDataModuleProps) => {
	const clientUuid = useAuthStore((store) => store.clientUuid);
	const showWindow = useSceneStore((store) => store.showWindow);
	const setShowWindow = useSceneStore((store) => store.setShowWindow);

	const [ xpProgress, setXPProgress ] = useState(0);
	const [ createdAt, setCreatedAt ] = useState<Date | null>(null);

	useEffect(() => {
		let mounted = true;

		if (!uuid) {
			setCreatedAt(null);
			setBadge?.("Newcomer");
			setXPProgress(0);
			return;
		}

		const fetchPlayerData = async () => {
			try {
				const [createdAtResp, profileResp] = await Promise.all([
					handleCreatedAt(uuid),
					handleGetProfile(uuid),
				]);

				if (!mounted)
					return;

				setCreatedAt(createdAtResp);
				if (profileResp?.badge)
					setBadge?.(profileResp.badge);

				// 	const percentage = (profile.xp / (profile.level * 1000)) * 100
				// 	setXPProgress(percentage);
			} catch (error) {
				console.error("Failed to fetch player data:", error);
			}
		};
		fetchPlayerData();

		return () => {
			mounted = false;
		};
	}, [uuid]);

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
				{/* <h2>Level {profile ? profile.level : "n/a"}</h2> */}
				<h2>Level n/a</h2>
				<div className="w-full">
					<p className="text-center">
						{/* XP: {profile ? profile.xp : "n/a"} / {profile ? profile.level * 1000 : "n/a"} */}
						XP: n/a / n/a
					</p>
					<div className="
						h-2
						rounded-full
						bg-a0
						border border-b5 self-center
						mt-1
					">
						<div 
							style={{ width: `${xpProgress}%` }}
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
						/>
					}
				</div>
				<PlayerStatusModule uuid={uuid ?? ""}/>
			</div>
			<div className="text-a5">
				<p>UUID: {uuid}</p>
				<p>Joined: {createdAt?.toString() ?? "n/a"}</p>
			</div>
		</div>
	);
}