import { useState } from "react";
import { usePartyStore } from "../../store/PartyStore";
import { useProfileStore } from "../../store/ProfileStore";
import { useSceneStore } from "../../store/SceneStore";
import { Window } from "../window/Window";
import { AvatarSetNameModule } from "../avatar/name/AvatarSetNameModule";
import { AvatarSelectModule } from "../avatar/image/AvatarSetImageModule";
import { MedalsModule } from "../player/medals/MedalsModule";
import { PlayerDataModule } from "../player/data/PlayerDataModule";
import { PlayerStatsModule } from "../player/stats/PlayerStatsModule";
import { LeavePartyModule } from "./LeavePartyModule";

export const ProfileWindow = () => {
	const { setShowWindow } = useSceneStore();

	const { clientUuid, getProfileData, updateClientProfile } = useProfileStore();
	if (!clientUuid)
		return;
	
	const data = getProfileData(clientUuid!);
	if (!data || !data.name)
		return;
	const { members, set1PlayerParty } = usePartyStore();

	const [name, setName] = useState(data.name);
	const [avatar, setAvatar] = useState(data.avatar!);
	const [badge, setBadge] = useState(data.badge);
	const isValid = Boolean(name?.trim());

	const handleProfileUpdate = () => {
		if (!isValid)
			return;
		updateClientProfile(name, avatar, badge);
		if (members.length <= 0)
			set1PlayerParty();
		setShowWindow("profile", false);
	}

	return (
		<Window
			title={`Profile`}
			dismissKey="profile"
			isDismissable={isValid}
			hasPinButton={false}
			call={handleProfileUpdate}
		>
			<div
				className="
					divide-y divide-n2/40
					py-1rem px-3rem
					max-h-[85vh] overflow-y-scroll
				"
			>
				<div className="flex">
					<AvatarSetNameModule
						name={name}
						setName={setName}
					/>
					<PlayerDataModule
						profile={data}
						badge={badge}
						setBadge={setBadge}
					/>
				</div>
				<AvatarSelectModule
					avatar={avatar}
					setAvatar={setAvatar}
				/>
				<MedalsModule />
				<PlayerStatsModule profile={data} />
				{ members.length > 1 && <LeavePartyModule /> }
			</div>
		</Window>
	);
}