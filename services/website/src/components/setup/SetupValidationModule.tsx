import { handlePutProfile } from "../../api/profile/put_profile/handlePutProfile";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../store/NotificationStore";
import { useProfileStore } from "../../store/ProfileStore";
import { useSceneStore } from "../../store/SceneStore";
import { useGameStatsStore } from "../../store/GameStatsStore";
import { checkNameValidity } from "../../utilities/react/checkNameValidity";

interface SetupValidationModuleProps {
	name: string;
	avatar: string;
}

export const SetupValidationModule = ({ name, avatar }: SetupValidationModuleProps) => {
	const isNameValid = checkNameValidity(name);
	const isAvatarValid = Boolean(avatar);
	const isValid = isNameValid && isAvatarValid;

	const handleSetupComplete = () => {
		if (!isValid)
			return;

		void handlePutProfile(name, avatar, "Newcomer")
			.then(() => {
				useProfileStore.getState().setCachedProfile();
				useGameStatsStore.getState().setCachedStats();
				useNotificationStore.getState().showNotification("Profile created", NOTIFICATION_TYPE.message);
				useSceneStore.getState().setShowWindow("setup", false);
			})
			.catch((error) => {
				console.warn("Failed to handle update profile:", error);
			});
	};

	return (
		<div className="
			flex flex-col place-content-center place-items-center
			gap-1rem
			text-n6
			py-2rem
		">
			<h3 className="text-center">
				{
					isValid ? `Welcome ${name}! You're all set up!` :
					isNameValid && !isAvatarValid ? "Waiting for valid avatar..." :
					!isValid && name.length > 0 ? "Name must be 3–20 characters and contain only letters, numbers, hyphens, or underscores" :
					!isNameValid && isAvatarValid ? "Waiting for valid name..." :
					"Enter your name and choose your avatar"
				}
			</h3>
			<button
				type="button"
				disabled={!isValid}
				onClick={handleSetupComplete}
				className="
					h-3rem aspect-10/1
					btn-text bg-white
					text-n0
			">
				{
					isValid ? "Let's Play!" :
					"Waiting for valid name and avatar..."
				}
			</button>
		</div>
	);
}