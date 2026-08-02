import { Window } from "../window/Window";
import { AvatarInputModule } from "../avatar/AvatarInputModule";
import { AvatarSelectModule } from "../avatar/AvatarSelectModule";
import { MedalsModule } from "../player/medals/MedalsModule";
import { PlayerDataModule } from "../player/data/PlayerDataModule";
import { PlayerStatsModule } from "../player/stats/PlayerStatsModule";
import { LeavePartyModule } from "./LeavePartyModule";

export const ProfileWindow = () => {
	return (
		<Window
			title={`Profile`}
			dismissKey="profile"
		>
			<div className="
				relative
				px-3rem
			">
				<div className="divide-y divide-n2">
					<div className="flex">
						<AvatarInputModule />
						<PlayerDataModule />
					</div>
					<AvatarSelectModule />
					<MedalsModule />
					<PlayerStatsModule />
					<LeavePartyModule />
				</div>
			</div>
		</Window>
	);
}