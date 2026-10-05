import { useState, useRef, useEffect } from "react";
import { handleCreatedAt } from "../../api/authentication/created_at/handleCreatedAt";
import { handleGetOnline } from "../../api/party/get_online/handleGetOnline";
import { handleGetProfile } from "../../api/profile/get_profile/handleGetProfile";
import { usePartyStore, type AVAILABILITY_TYPE } from "../../store/PartyStore";
import type { BADGE_TYPE } from "../../store/ProfileStore";
import { useSceneStore } from "../../store/SceneStore";
import { Window } from "../window/Window";
import { AvatarMemberModule } from "../avatar/AvatarMemberModule";
import { MedalsModule } from "../player/medals/MedalsModule";
import { PlayerDataModule } from "../player/data/PlayerDataModule";
import { PlayerStatsModule } from "../player/stats/PlayerStatsModule";
import { FriendToggleButton } from "./friend/FriendToggleButton";
import { KickPlayerButton } from "./kick/KickPlayerButton";

export const StatsWindow: React.FC = () => {
	const statsUuid = useSceneStore((store) => store.statsUuid!);
	const members = usePartyStore((store) => store.members);

	const [name, setName] = useState<string | null>(null);
	const [avatar, setAvatar] = useState<string | undefined>(undefined);
	const [badge, setBadge] = useState<BADGE_TYPE | null>(null);
	const [createdAt, setCreatedAt] = useState<Date | null>(null);
	const [availability, setAvailability] = useState<AVAILABILITY_TYPE | null>(null);
	const [lastOnline, setLastOnline] = useState<Date | null>(null);

	const statsFetched = useRef<string | null>(null);
	useEffect(() => {
		if (statsFetched.current)
			return;
		statsFetched.current = statsUuid;

		const fetchPlayerData = async () => {
			try {
				const [profile, createdAt, online] = await Promise.all([
					handleGetProfile(statsUuid),
					handleCreatedAt(statsUuid),
					handleGetOnline(statsUuid),
				]);

				setName(profile?.username ?? null);
				setAvatar(profile?.avatarPath ?? undefined);
				setBadge(profile?.badge ?? null);

				setCreatedAt(createdAt ?? null);

				if (online?.isOnline)
					setAvailability(online.inParty ? "Busy" : "Online");
				else {
					setAvailability("Offline");
					setLastOnline(online?.lastOnline ? new Date(online.lastOnline) : null);
				}
			} catch (error) {
				console.error("Failed to fetch player data:", error);
			}
		};
		fetchPlayerData();
	}, [statsUuid]);

	return (
		<Window
			title={`Player Profile: ${name ?? "-"}`}
			dismissKey="stats"
			lightbox={true}
		>
			<div className="
				px-3rem
				divide-y divide-n2/40
			">
				<div className="flex">
					<AvatarMemberModule uuid={statsUuid} name={name ?? "-"} image={avatar} />
					<PlayerDataModule
						uuid={statsUuid}
						badge={badge}
						availability={availability}
						lastOnline={lastOnline}
						createdAt={createdAt}
					/>
				</div>
				<MedalsModule uuid={statsUuid}/>
				<PlayerStatsModule uuid={statsUuid} />
				<div className="
					flex place-content-evenly place-items-center
					py-2rem px-2rem
					gap-1rem
				">
					{ members && statsUuid && members.includes(statsUuid) && <KickPlayerButton playerUuid={statsUuid}/>}
					<FriendToggleButton uuid={statsUuid!}/>
				</div>
			</div>
		</Window>
	);
};