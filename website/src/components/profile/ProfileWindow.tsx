import { AvatarInputModule } from "../avatar/AvatarInputModule";
import { AvatarSelectModule } from "../avatar/AvatarSelectModule";
import { MedalsModule } from "../player/medals/MedalsModule";
import { PlayerDataModule } from "../player/data/PlayerDataModule";
import { PlayerStatsModule } from "../player/stats/PlayerStatsModule";
import { Window } from "../window/Window";

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
						<AvatarInputModule />
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