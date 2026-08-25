import { useState, useEffect } from "react";
import { useProfileStore, type ProfileData, type BADGE_TYPE } from "../../../store/ProfileStore";
import { useSceneStore } from "../../../store/SceneStore";
import { BadgeWindow } from "./badge/BadgeWindow";
import { PlayerStatusModule } from "../status/PlayerStatusModule";

interface PlayerDataModule {
	profile: ProfileData | undefined,
	badge?: BADGE_TYPE,
	setBadge?: (type: BADGE_TYPE) => void;
}
export const PlayerDataModule = ({ profile, badge, setBadge }: PlayerDataModule) => {
	if (!profile)
		return;
	const { clientUuid } = useProfileStore();
	const { showWindow, setShowWindow } = useSceneStore();
	const [ xpProgress, setXPProgress ] = useState(0);

	useEffect(() => {
		const percentage = (profile.xp / (profile.level * 1000)) * 100
		setXPProgress(percentage);
	}, [profile, profile.level, profile.xp]);

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
				<h2>Level {profile.level}</h2>
				<div className="w-full">
					<p className="text-center">
						XP: {profile.xp} / {profile.level * 1000}
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
				flex
				place-content-between place-items-center
				gap-2rem
			">
				<div className="relative w-full flex">
					{ clientUuid === profile.uuid
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
								<i>{profile.badge}</i>
							</h2>
					}
					{ showWindow["badge"] && badge && setBadge &&
						<BadgeWindow
							badge={badge}
							setBadge={setBadge}
						/>
					}
				</div>
				<PlayerStatusModule status={profile.availability}/>
			</div>
			<div className="text-a5">
				<p>Last Login: {profile.lastLogin.toString()}</p>
				<p>Joined: {profile.createdAt.toString()}</p>
				<p>UUID: {profile.uuid}</p>
			</div>
		</div>
	);
}