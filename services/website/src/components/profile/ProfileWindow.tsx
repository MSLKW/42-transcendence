import { useState } from "react";
import { partySocket } from "../../api/party/partySocket";
import { handlePutProfile } from "../../api/profile/put_profile/handlePutProfile";
import { useAuthStore } from "../../store/AuthStore";
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

export const ProfileWindow = () => {
	const clientUuid = useAuthStore((store) => store.clientUuid);
	if (!clientUuid)
		return;
	const setShowWindow = useSceneStore((store) => store.setShowWindow);
	const getProfileData = useProfileStore((store) => store.getProfileData);
	const cachedData = useProfileStore((store) => store.cachedData);
	const members = usePartyStore((store) => store.members);

	const profileData = getProfileData(clientUuid!);

	const [name, setName] = useState(cachedData[clientUuid ?? ""]?.name ?? "n/a");
	const [avatar, setAvatar] = useState(cachedData[clientUuid ?? ""]?.avatar ?? undefined);
	const [badge, setBadge] = useState<BADGE_TYPE>(cachedData[clientUuid ?? ""]?.badge ?? "Newcomer");

	const isValid = Boolean(name?.trim());

	const handleProfileUpdate = () => {
		if (!isValid)
			return;

		void handlePutProfile(name, avatar ?? "avatar-unknown.webp", badge).then(async () => {
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
						avatar={avatar ?? "avatar-unknown.webp"}
						uuid={clientUuid}
					/>
					<PlayerDataModule
						profile={profileData}
						uuid={clientUuid}
						badge={badge}
						setBadge={setBadge}
					/>
				</div>
				<AvatarSelectModule
					avatar={avatar ?? "avatar-unknown.webp"}
					setAvatar={setAvatar}
				/>
				<MedalsModule uuid={clientUuid}/>
				<PlayerStatsModule profile={profileData} />
				{ members.length > 1 && <LeavePartyModule /> }
			</div>
		</Window>
	);
}