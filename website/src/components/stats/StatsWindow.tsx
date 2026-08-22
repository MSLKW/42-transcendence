import { usePartyStore } from "../../store/PartyStore";
import { useProfileStore } from "../../store/ProfileStore";
import { useSceneStore } from "../../store/SceneStore";
import { Window } from "../window/Window";
import { AvatarMemberModule } from "../avatar/AvatarMemberModule";
import { MedalsModule } from "../player/medals/MedalsModule";
import { PlayerDataModule } from "../player/data/PlayerDataModule";
import { PlayerStatsModule } from "../player/stats/PlayerStatsModule";
import { FriendToggleButton } from "./friend/FriendToggleButton";
import { KickMemberButton } from "./kick/KickMemberButton";

export const StatsWindow: React.FC = () => {
	const { profileUuid } = useSceneStore();
	const { getProfileData } = useProfileStore();
	const data = getProfileData(profileUuid!);
	const { members } = usePartyStore();

	return (
		<Window
			title={`Player Profile: ${data?.name ?? "Player"}`}
			dismissKey="stats"
		>
			<div
				className="
					px-3rem
					divide-y divide-n2/40
				"
			>
				<div className="flex">
					<AvatarMemberModule name={data?.name ?? "Player"} image={data?.avatar ?? "stock-0.png"} />
					<PlayerDataModule profile={data ?? undefined} />
				</div>
				<MedalsModule />
				<PlayerStatsModule profile={data ?? undefined} />
				<div
					className="
						flex place-content-evenly place-items-center
						py-2rem px-2rem
						gap-1rem
					"
				>
					{ members && profileUuid && members.includes(profileUuid) && <KickMemberButton playerUuid={profileUuid}/>}
					<FriendToggleButton uuid={profileUuid!}/>
				</div>
			</div>
		</Window>
	);
};