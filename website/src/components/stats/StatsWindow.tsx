import { useSceneStore } from "../../store/SceneStore";
import { usePartyStore } from "../../store/PartyStore";
import { Window } from "../window/Window";
import { AvatarMemberModule } from "../avatar/AvatarMember";
import { MedalsModule } from "../player/medals/MedalsModule";
import { PlayerDataModule } from "../player/data/PlayerDataModule";
import { PlayerStatsModule } from "../player/stats/PlayerStatsModule";
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
			<div
				className="
					px-3rem
					divide-y divide-n2
				"
			>
				<div className="flex">
					<AvatarMemberModule name={members[profileIndex]?.name ?? "Guest"} />
					<PlayerDataModule />
				</div>
				<MedalsModule />
				<PlayerStatsModule />
				<div
					className="
						flex place-content-evenly place-items-center
						py-2rem px-2rem
						gap-1rem
					"
				>
					<KickMemberButton />
					<FriendToggleButton />
				</div>
			</div>
		</Window>
	);
};