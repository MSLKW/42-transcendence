import { useSceneStore } from "../../store/SceneStore";
import { usePartyStore } from "../../store/PartyStore";
import { Window } from "../window/Window";
import { AvatarMemberModule } from "../avatar/AvatarMember";
import { MedalsModule } from "../player/medals/MedalsModule";
import { PlayerDataModule } from "../player_data/PlayerDataModule";
import { PlayerStatsModule } from "../player_stats/PlayerStatsModule";
import { FriendToggleButton } from "./friend/FriendToggleButton";
import { KickMemberButton } from "./kick/KickMemberButton";

export const StatsWindow: React.FC = () => {
	const { profileIndex } = useSceneStore();
	const { members } = usePartyStore();
	

	return (
		<Window
			title={`Stats: ${members[profileIndex]?.name || "Guest"}`}
			dismissKey="stats"
			profileIndex={profileIndex}
		>
			<div className="window-body divide-y divide-n2">
				<div className="flex">
					<AvatarMemberModule name={members[profileIndex]?.name ?? "Guest"} />
					<PlayerDataModule />
				</div>
				<MedalsModule />
				<PlayerStatsModule />
				<div className="flex place-content-evenly place-items-center p-5 gap-5">
					<KickMemberButton />
					<FriendToggleButton />
				</div>
			</div>
		</Window>
	);
};