import { usePlayerStore } from "../store/PlayerStore";
import { AvatarNameModule } from "../modules/AvatarName";
import { AvatarSelectModule } from "../modules/AvatarSelectModule";
import { CloseModule } from "../modules/Close";
import { MedalsModule } from "../modules/Medals";
import { PlayerDataModule } from "../modules/PlayerData";
import { PlayerStatsModule } from "../modules/PlayerStats";
import { LightboxButton } from "../components/button/Lightbox";

export const ProfileWindow = () => {
	const { data } = usePlayerStore();

	return (
		<section className="
			absolute z-1
			top-0 left-0
			h-full w-full
			flex place-content-center place-items-center
		">
			<LightboxButton dismiss={data.name ? "profile" : ""} blur={true} />
			<div className="
				h-fit w-120
				bg-linear-to-b from-n0 to-n1
				border border-n1 rounded-xl
				relative
			">
				<CloseModule dismiss={data.name ? "profile" : ""} />
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
		</section>
	);
}