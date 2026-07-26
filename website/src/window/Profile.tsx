import { AvatarNameModule } from "../modules/AvatarName";
import { AvatarSelectModule } from "../modules/AvatarSelectModule";
import { MedalsModule } from "../modules/Medals";
import { PlayerDataModule } from "../modules/PlayerData";
import { PlayerStatsModule } from "../modules/PlayerStats";
import { Window } from "./Window";

export const ProfileWindow = () => {

	return (
		<Window
			title={`Profile`}
			dismissKey="profile"
		>
			<div className="
				h-fit w-120
				bg-linear-to-b from-n0 to-n1
				border border-n1 rounded-xl
				relative
			">
				<div className="divide-y divide-n2">
					<div className="flex">
						<AvatarNameModule />
						<PlayerDataModule />
					</div>
					<AvatarSelectModule />
					<MedalsModule />
					<PlayerStatsModule />
				</div>
			</div>
		</Window>
	);
}