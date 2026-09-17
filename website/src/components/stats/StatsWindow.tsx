import { usePartyStore } from "../../store/PartyStore";
import { useProfileStore } from "../../store/ProfileStore";
import { useSceneStore } from "../../store/SceneStore";
import { Window } from "../window/Window";
import { AvatarMemberModule } from "../avatar/AvatarMemberModule";
import { MedalsModule } from "../player/medals/MedalsModule";
import { PlayerDataModule } from "../player/data/PlayerDataModule";
import { PlayerStatsModule } from "../player/stats/PlayerStatsModule";
import { FriendToggleButton } from "./friend/FriendToggleButton";
import { KickPlayerButton } from "./kick/KickPlayerButton";

export const StatsWindow: React.FC = () => {
	const profileUuid = useSceneStore((store) => store.profileUuid);
	const members = usePartyStore((store) => store.members);

	const cachedData = useProfileStore((store) => store.cachedData);

	return (
		<Window
			title={`Player Profile: ${cachedData[profileUuid ?? ""]?.name ?? "-"}`}
			dismissKey="stats"
		>
			<div
				className="
					px-3rem
					divide-y divide-n2/40
				"
			>
				<div className="flex">
					<AvatarMemberModule uuid={profileUuid} name={cachedData[profileUuid ?? ""]?.name ?? "-"} image={cachedData[profileUuid ?? ""]?.avatar ?? undefined} />
					<PlayerDataModule uuid={profileUuid}/>
				</div>
				<MedalsModule uuid={profileUuid}/>
				<PlayerStatsModule uuid={profileUuid} />
				<div
					className="
						flex place-content-evenly place-items-center
						py-2rem px-2rem
						gap-1rem
					"
				>
					{ members && profileUuid && members.includes(profileUuid) && <KickPlayerButton playerUuid={profileUuid}/>}
					<FriendToggleButton uuid={profileUuid!}/>
				</div>
			</div>
		</Window>
	);
};