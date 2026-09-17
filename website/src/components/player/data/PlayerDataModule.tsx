import { useState, useEffect } from "react";
import { useAuthStore } from "../../../store/AuthStore";
import type { ProfileData, BADGE_TYPE } from "../../../store/ProfileStore";
import { useSceneStore } from "../../../store/SceneStore";
import { BadgeWindow } from "./badge/BadgeWindow";
import { PlayerStatusModule } from "../status/PlayerStatusModule";
import { handleCreatedAt } from "../../../api/authentication/created_at/handleCreatedAt";

interface PlayerDataModule {
	profile?: ProfileData | undefined;
	uuid: string | null;
	badge?: BADGE_TYPE;
	setBadge?: (type: BADGE_TYPE) => void;
}
export const PlayerDataModule = ({ profile, uuid, badge, setBadge }: PlayerDataModule) => {
	const clientUuid = useAuthStore((store) => store.clientUuid);
	const showWindow = useSceneStore((store) => store.showWindow);
	const setShowWindow = useSceneStore((store) => store.setShowWindow);

	const [ xpProgress, setXPProgress ] = useState(0);
	const [ createdAt, setCreatedAt ] = useState<string | undefined>(undefined);

	useEffect(() => {
		if (!profile) {
			setXPProgress(0);
			return;
		}
		const percentage = (profile.xp / (profile.level * 1000)) * 100
		setXPProgress(percentage);

		let mounted = true;
		const getCreatedAt = async () => {
			if (!uuid)
				return;
			const response = await handleCreatedAt(uuid);
			if (mounted)
				setCreatedAt(response.createdAt);
		};
		getCreatedAt();

		return () => {
			mounted = false;
		};
	}, [profile]);

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
				<h2>Level {profile ? profile.level : "n/a"}</h2>
				<div className="w-full">
					<p className="text-center">
						XP: {profile ? profile.xp : "n/a"} / {profile ? profile.level * 1000 : "n/a"}
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
					{ clientUuid === profile?.uuid
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
								<i>{profile ? profile.badge : "n/a"}</i>
							</h2>
					}
					{ showWindow["badge"] && badge && setBadge &&
						<BadgeWindow
							badge={badge}
							setBadge={setBadge}
						/>
					}
				</div>
				<PlayerStatusModule status={profile ? profile.availability : "Online"}/>
			</div>
			<div className="text-a5">
				<p>UUID: {profile ? profile?.uuid : "n/a"}</p>
				<p>Joined: {createdAt ? createdAt : "n/a"}</p>
				<p>Last Login: {profile ? profile.lastLogin.toString() : "n/a"}</p>
			</div>
		</div>
	);
}