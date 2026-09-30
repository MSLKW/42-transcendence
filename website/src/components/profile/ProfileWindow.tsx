import { useState, useRef, useEffect } from "react";
import { partySocket } from "../../api/party/partySocket";
import { handleCreatedAt } from "../../api/authentication/created_at/handleCreatedAt";
import { handlePutProfile } from "../../api/profile/put_profile/handlePutProfile";
import { useAuthStore } from "../../store/AuthStore";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../store/NotificationStore";
import { usePartyStore } from "../../store/PartyStore";
import { useProfileStore, type BADGE_TYPE } from "../../store/ProfileStore";
import { useSceneStore } from "../../store/SceneStore";
import { checkNameValidity } from "../../utilities/react/checkNameValidity";
import { Window } from "../window/Window";
import { AvatarSetNameModule } from "../avatar/name/AvatarSetNameModule";
import { AvatarSelectModule } from "../avatar/image/AvatarSelectModule";
import { MedalsModule } from "../player/medals/MedalsModule";
import { PlayerDataModule } from "../player/data/PlayerDataModule";
import { PlayerStatsModule } from "../player/stats/PlayerStatsModule";
import { LeavePartyModule } from "./LeavePartyModule";

export const ProfileWindow = () => {
	const clientUuid = useAuthStore((store) => store.clientUuid);
	const members = usePartyStore((store) => store.members);
	const profileValidation = useProfileStore((store) => store.profileValidation);
	const cachedData = useProfileStore((store) => store.cachedData);
	const setShowWindow = useSceneStore((store) => store.setShowWindow);

	const profile = clientUuid ? cachedData[clientUuid] : undefined;
	const [name, setName] = useState(profile?.name ?? "n/a");
	const [avatar, setAvatar] = useState(profile?.avatar ?? undefined);
	const [badge, setBadge] = useState<BADGE_TYPE>(profile?.badge ?? "Newcomer");
	const [hasChange, setHasChange] = useState(false);
	const [createdAt, setCreatedAt] = useState<Date | null>(null);

	const createdAtFetched = useRef<string | null>(null);
	useEffect(() => {
		if (!clientUuid || createdAtFetched.current)
			return;
		createdAtFetched.current = clientUuid;

		const fetchCreatedAt = async () => {
			try {
				const createdAt = await handleCreatedAt(clientUuid);
				setCreatedAt(createdAt ?? null);
			} catch (error) {
				console.error("Failed to fetch player data:", error);
			}
		};
		fetchCreatedAt();
	}, [clientUuid]);

	const isNameValid = checkNameValidity(name?.trim());
	const isAvatarValid = Boolean(avatar);
	const isBadgeValid = Boolean(badge);
	const isValid = isNameValid && isAvatarValid && isBadgeValid;
	const handleProfileUpdate = () => {
		if (profileValidation && !isValid)
			return;

		if (!hasChange)
			setShowWindow("profile", false);

		void handlePutProfile(name, avatar!, badge)
			.then(() => {
				partySocket.refresh()
				useNotificationStore.getState().showNotification("Profile updated", NOTIFICATION_TYPE.message);
				setShowWindow("profile", false);
			}).catch (() => {});
	}

	return (
		<Window
			title={`Profile`}
			dismissKey="profile"
			isDismissable={profileValidation ? isValid : true}
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
						uuid={clientUuid ?? undefined}
						setHasChange={setHasChange}
					/>
					<PlayerDataModule
						uuid={clientUuid ?? ""}
						badge={badge}
						availability="Online"
						lastOnline={null}
						createdAt={createdAt}
						setBadge={setBadge}
						setHasChange={setHasChange}
					/>
				</div>
				{profileValidation && !isNameValid &&
					<h3 className="text-n6 text-center mb-5">Name must be 3–20 characters and contain only letters, numbers, hyphens, or underscores</h3>
				}
				<AvatarSelectModule
					avatar={avatar ?? undefined}
					setAvatar={setAvatar}
					setHasChange={setHasChange}
				/>
				<MedalsModule uuid={clientUuid}/>
				<PlayerStatsModule uuid={clientUuid} />
				{ members.length > 1 && <LeavePartyModule /> }
			</div>
		</Window>
	);
}