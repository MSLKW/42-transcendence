import { useState, useEffect } from "react";
import { partySocket } from "../../api/party/partySocket";
import { handlePutProfile } from "../../api/profile/put_profile/handlePutProfile";
import { useAuthStore } from "../../store/AuthStore";
import { usePartyStore } from "../../store/PartyStore";
import { useProfileStore, type BADGE_TYPE } from "../../store/ProfileStore";
import { useSceneStore } from "../../store/SceneStore";
import { Window } from "../window/Window";
import { AvatarSetNameModule } from "../avatar/name/AvatarSetNameModule";
import { AvatarSelectModule } from "../avatar/image/AvatarSelectModule";
import { MedalsModule } from "../player/medals/MedalsModule";
import { PlayerDataModule } from "../player/data/PlayerDataModule";
import { PlayerStatsModule } from "../player/stats/PlayerStatsModule";
import { LeavePartyModule } from "./LeavePartyModule";

export const ProfileWindow = () => {
	const clientUuid = useAuthStore((store) => store.clientUuid);
	const setShowWindow = useSceneStore((store) => store.setShowWindow);
	const cachedData = useProfileStore((store) => store.cachedData);
	const members = usePartyStore((store) => store.members);

	const profile = clientUuid ? cachedData[clientUuid] : undefined;

	const [name, setName] = useState(profile?.name ?? "n/a");
	const [avatar, setAvatar] = useState(profile?.avatar ?? undefined);
	const [badge, setBadge] = useState<BADGE_TYPE>(profile?.badge ?? "Newcomer");

	useEffect(() => {
		if (!clientUuid)
			return;

		const profile = cachedData[clientUuid];
		setName(profile?.name ?? "n/a");
		setAvatar(profile?.avatar ?? undefined);
		setBadge(profile?.badge ?? "Newcomer");
	}, [clientUuid, cachedData]);

	if (!clientUuid)
		return null;

	const isValid = Boolean(name?.trim());

	const handleProfileUpdate = () => {
		if (!isValid || !name || !avatar || !badge)
			return;

		void handlePutProfile(name, avatar, badge).then(async () => {
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
			<div className="
				max-h-[85vh] w-[80vw] max-w-215
				py-1rem px-3rem
				overflow-y-scroll
			">
				<div className="flex">
					<AvatarSetNameModule
						name={name}
						setName={setName}
						avatar={avatar ?? undefined}
						uuid={clientUuid}
					/>
					<PlayerDataModule
						uuid={clientUuid}
						badge={badge}
						setBadge={setBadge}
					/>
				</div>
				<AvatarSelectModule
					avatar={avatar ?? undefined}
					setAvatar={setAvatar}
				/>
				<MedalsModule uuid={clientUuid}/>
				<PlayerStatsModule uuid={clientUuid} />
				{ members.length > 1 && <LeavePartyModule /> }
			</div>
		</Window>
	);
}