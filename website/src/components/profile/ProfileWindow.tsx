import { useState } from "react";
import { partySocket } from "../../api/party/partySocket";
import { usePartyStore } from "../../store/PartyStore";
import { useProfileStore, type BADGE_TYPE } from "../../store/ProfileStore";
import { useSceneStore } from "../../store/SceneStore";
import { Window } from "../window/Window";
import { AvatarSetNameModule } from "../avatar/name/AvatarSetNameModule";
import { AvatarSelectModule } from "../avatar/image/AvatarSetImageModule";
import { MedalsModule } from "../player/medals/MedalsModule";
import { PlayerDataModule } from "../player/data/PlayerDataModule";
import { PlayerStatsModule } from "../player/stats/PlayerStatsModule";
import { LeavePartyModule } from "./LeavePartyModule";
import { handlePutProfile } from "../../api/profile/put_profile/handlePutProfile";

export const ProfileWindow = () => {
	const { setShowWindow } = useSceneStore();

	const { clientUuid, getProfileData, getCachedData, setCachedData } = useProfileStore();
	if (!clientUuid)
		return;
	
	const profileData = getProfileData(clientUuid!);
	const cachedData = getCachedData(clientUuid!);

	const { members } = usePartyStore();

	const [name, setName] = useState(cachedData?.name ?? "Player");
	const [avatar, setAvatar] = useState(cachedData?.avatar ?? "avatar-unknown.webp");
	const [badge, setBadge] = useState<BADGE_TYPE>(cachedData?.badge ?? "Newcomer");

	const isValid = Boolean(name?.trim());

	const handleProfileUpdate = () => {
		if (!isValid)
			return;

		void handlePutProfile(name, avatar, badge).then(() => {
			setCachedData();
			setShowWindow("profile", false);
			partySocket.refresh();
		});
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
					max-h-[85vh] w-[80vw] max-w-215
					py-1rem px-3rem
					overflow-y-scroll
				"
			>
				<div className="flex">
					<AvatarSetNameModule
						name={name}
						setName={setName}
						avatar={avatar}
						uuid={clientUuid}
					/>
					<PlayerDataModule
						profile={profileData}
						badge={badge}
						setBadge={setBadge}
					/>
				</div>
				<AvatarSelectModule
					avatar={avatar}
					setAvatar={setAvatar}
				/>
				<MedalsModule uuid={clientUuid}/>
				<PlayerStatsModule profile={profileData} />
				{ members.length > 1 && <LeavePartyModule /> }
			</div>
		</Window>
	);
}