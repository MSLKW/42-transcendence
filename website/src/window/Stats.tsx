import React, { useState } from "react";
import { useSceneStore } from "../store/SceneStore";
import { usePartyStore } from "../store/PartyStore";
import { AvatarMemberModule } from "../modules/AvatarMember";
import { MedalsModule } from "../modules/Medals";
import { PlayerDataModule } from "../modules/PlayerData";
import { PlayerStatsModule } from "../modules/PlayerStats";
import { Window } from "./Window";
import { UnfriendIcon } from "../components/icon/Unfriend";
import { AddFriendIcon } from "../components/icon/AddFriend";
import { partySocket } from "../services/partySocket";

export const StatsWindow: React.FC = () => {
	const { profileIndex } = useSceneStore();
	const { members } = usePartyStore();
	const [isFriend, setIsFriend] = useState(false);
	const handleKickMember = () => {
		partySocket.kickMember("12345678-abcd-efgh-ijkl-000000000000");
	}
	const handleToggleAsFriend = () => {
		setIsFriend(!isFriend);
		partySocket.toggleAsFriend("12345678-abcd-efgh-ijkl-000000000000");
	}

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
					<button
						onClick={handleKickMember}
						className="
							h-3rem w-50 btn-text bg-n6 border border-n5 text-n0
						"
					>
						Remove From Party
					</button>
					<button
						onClick={handleToggleAsFriend}
						className="
							h-12 w-50
							btn-text
							text-n0 border border-n5 bg-n6
							flex
							place-content-center place-items-center
						"
					>
						{isFriend ? (
							<>
								<div className="h-10 aspect-square"><UnfriendIcon /></div>
								<span>Unfriend</span>
							</>
						) : (
							<>
								<div className="h-10 aspect-square"><AddFriendIcon /></div>
								<span>Add Friend</span>
							</>
						)}
					</button>
				</div>
			</div>
		</Window>
	);
};