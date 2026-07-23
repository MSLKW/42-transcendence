import { useSceneStore } from "../store/SceneStore";
import { AvatarMemberModule } from "../modules/AvatarMember";
import { CloseModule } from "../modules/Close";
import { MedalsModule } from "../modules/Medals";
import { PlayerDataModule } from "../modules/PlayerData";
import { PlayerStatsModule } from "../modules/PlayerStats";
import { LightboxButton } from "../components/button/Lightbox";

export const StatsWindow = () => {
	const { profileFocus } = useSceneStore();
	return (
		<section className="
			absolute z-1
			top-0 left-0
			h-full w-full
			flex place-content-center place-items-center
		">
			<LightboxButton dismiss="stats" blur={true} />
			<div className="
				h-fit w-120
				bg-linear-to-b from-n0 to-n1
				border border-n2 rounded-xl
				relative
			">
				<CloseModule dismiss="stats" />
				<div className="divide-y divide-n2">
					<div className="flex">
						<AvatarMemberModule />
						{/* <PlayerDataModule /> */}
						<p className="text-n6">{profileFocus}</p>
					</div>
					{/* <MedalsModule /> */}
					{/* <PlayerStatsModule /> */}
				</div>
			</div>
		</section>
	);
}