import { useState } from "react";
import { useSceneStore } from "../store/SceneStore";
import { usePartyStore } from "../store/PartyStore";
import { AvatarMemberModule } from "../modules/AvatarMember";
import { CloseModule } from "../modules/Close";
import { MedalsModule } from "../modules/Medals";
import { PlayerDataModule } from "../modules/PlayerData";
import { PlayerStatsModule } from "../modules/PlayerStats";
import { LightboxButton } from "../components/button/Lightbox";
import { UnfriendIcon } from "../components/icon/Unfriend";
import { AddFriendIcon } from "../components/icon/AddFriend";

export const StatsWindow = () => {
	const { profileIndex } = useSceneStore();
	const { members } = usePartyStore();
	const [ isFriend, setIsFriend ] = useState(false);
	
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
						<AvatarMemberModule name={members[profileIndex].name ?? "Guest"} />
						<PlayerDataModule />
					</div>
					<MedalsModule />
					<PlayerStatsModule />
					<div
						className="
							flex
							place-content-evenly place-items-center
							p-5
						"
					>
						<button
							className="
								h-12 w-50
								btn-text
								bg-n6
								border border-n5
								text-n0
							"
						>
							Remove From Party
						</button>
						<button
							onClick={() => setIsFriend(!isFriend)}
							className="
								h-12 w-50
								btn-text
								text-n0 border border-n5 bg-n6
								flex
								place-content-center place-items-center
							"
						>
							{isFriend
								?
									<>
										<div className="h-10 aspect-square">
											<UnfriendIcon />
										</div>
										<span>Unfriend</span>
									</>
								:
									<>
										<div className="h-10 aspect-square">
											<AddFriendIcon />
										</div>
										<span>Add Friend</span>
									</>
							}
						</button>
					</div>
				</div>
			</div>
		</section>
	);
}