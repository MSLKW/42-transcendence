import { useState, useRef, useEffect } from "react";
import { partySocket } from "../../api/party/partySocket";
import { handleCreatedAt } from "../../api/authentication/get_created-at/handleCreatedAt";
import { handlePutProfile } from "../../api/profile/put_profile/handlePutProfile";
import { handleOwnPlayerGameData } from "../../api/gameStats/get_own-player-game-data/handleOwnPlayerGameData";
import { handleEasterEggFound } from "../../api/gameStats/post_easter-egg-found/handleEasterEggFound";
import { useAuthStore } from "../../store/AuthStore";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../store/NotificationStore";
import { usePartyStore } from "../../store/PartyStore";
import { useProfileStore } from "../../store/ProfileStore";
import { useSceneStore } from "../../store/SceneStore";
import { useGameStatsStore } from "../../store/GameStatsStore";
import { checkNameValidity } from "../../utilities/react/checkNameValidity";
import { Window } from "../window/Window";
import { AvatarSetNameModule } from "../avatar/name/AvatarSetNameModule";
import { AvatarSelectModule } from "../avatar/image/AvatarSelectModule";
import { AchievementsModule } from "../player/achievements/AchievementsModule";
import { PlayerDataModule } from "../player/data/PlayerDataModule";
import { PlayerStatsModule } from "../player/stats/PlayerStatsModule";
import { LeavePartyModule } from "./LeavePartyModule";

export const ProfileWindow = () => {
	const clientUuid = useAuthStore((store) => store.clientUuid);
	const members = usePartyStore((store) => store.members);
	const profileValidation = useProfileStore((store) => store.profileValidation);
	const cachedProfiles = useProfileStore((store) => store.cachedProfiles);
	const cachedStats = useGameStatsStore((store) => store.cachedStats);
	const cachedBadges = useGameStatsStore((store) => store.cachedBadges);

	const cachedProfile = clientUuid && clientUuid in cachedProfiles ? cachedProfiles[clientUuid] : undefined;
	const cachedStat = clientUuid && clientUuid in cachedStats ? cachedStats[clientUuid] : undefined;
	
	const [name, setName] = useState(cachedProfile?.name ?? "n/a");
	const [avatar, setAvatar] = useState(cachedProfile?.avatar ?? undefined);
	const [hasChange, setHasChange] = useState(false);
	const [createdAt, setCreatedAt] = useState<Date | null>(null);
	const [level, setLevel] = useState(cachedStat?.level ?? 0);
	const [xp, setXp] = useState(cachedStat?.xp ?? 0);
	const [currentLevelXpThreshold, setCurrentLevelXpThreshold] = useState(cachedStat?.currentLevelXpThreshold ?? 0);
	const [currentLevelProgressPercentage, setCurrentLevelProgressPercentage] = useState(cachedStat?.currentLevelProgressPercentage ?? 0);
	const [displayedBadgeId, setDisplayedBadgeId] = useState(cachedStat?.displayedBadgeId ?? "fresh_deal");
	const [totalPlayed, setTotalPlayed] = useState(cachedStat?.totalPlayed ?? 0);
	const [totalWins, setTotalWins] = useState(cachedStat?.totalWins ?? 0);
	const [winStreak, setWinStreak] = useState(cachedStat?.winStreak ?? 0);
	const [achievements, setAchievements] = useState(cachedStat?.achievements ?? undefined);
	const [availableBadges, setAvailableBadges] = useState(cachedBadges);

	const createdAtFetched = useRef<string | null>(null);
	useEffect(() => {
		if (!clientUuid || createdAtFetched.current)
			return;
		createdAtFetched.current = clientUuid;

		const fetchPlayerData = async () => {
			try {
				const [createdAt, clientStats] = await Promise.all([
					handleCreatedAt(clientUuid),
					handleOwnPlayerGameData(),
				]);

				setCreatedAt(createdAt ?? null);

				setLevel(clientStats.stats.level);
				setXp(clientStats.stats.xp);
				setDisplayedBadgeId(clientStats.stats.displayedBadgeId);
				setTotalPlayed(clientStats.stats.totalPlayed);
				setTotalWins(clientStats.stats.totalWins);
				setWinStreak(clientStats.stats.winStreak);

				setCurrentLevelXpThreshold(clientStats.levelProgress.currentLevelXpThreshold);
				setCurrentLevelProgressPercentage(clientStats.levelProgress.currentLevelProgressPercentage);

				setAchievements(clientStats.achievements);

				setAvailableBadges(clientStats.badges);
			} catch (error) {
				console.warn("Failed to fetch player data:", error);
			}
		}
		fetchPlayerData();
	}, [clientUuid]);

	const isNameValid = checkNameValidity(name?.trim());
	const isAvatarValid = Boolean(avatar);
	const isBadgeValid = Boolean(displayedBadgeId);
	const isValid = isNameValid && isAvatarValid && isBadgeValid;
	const handleProfileUpdate = () => {
		if (profileValidation && !isValid)
			return;

		useSceneStore.getState().setShowWindow("badge", false);
		if (!hasChange) {
			useSceneStore.getState().setShowWindow("profile", false);
			return;
		}

		void handlePutProfile(name, avatar!, displayedBadgeId)
			.then(async () => {
				partySocket.refresh()
				useNotificationStore.getState().showNotification("Profile updated", NOTIFICATION_TYPE.message);
				useSceneStore.getState().setShowWindow("profile", false);
				if (name.startsWith("bot-")) {
					const response = await handleEasterEggFound("egg_b31524145402");
					if (response["newlyGrantedBadgeIdForEasterEgg"])
						useNotificationStore.getState().showNotification("'Imposter' easter egg found!", NOTIFICATION_TYPE.message);
				}
				if (avatar === "avatar-animal-9.webp") {
					const response = await handleEasterEggFound("egg_5640cd1ea99b");
					if (response["newlyGrantedBadgeIdForEasterEgg"])
						useNotificationStore.getState().showNotification("'Connoisseur' easter egg found!", NOTIFICATION_TYPE.message);
				}
			})
			.catch((error) => {
				console.warn("Failed to handle update profile:", error);
			});
	}
	return (
		<Window
			title={`Profile`}
			dismissKey="profile"
			isDismissable={profileValidation ? isValid : true}
			call={handleProfileUpdate}
			lightbox={true}
		>
			<div className="
				max-h-[85vh] w-[80vw] max-w-215
				py-1rem px-3rem
				divide-y divide-n2/40
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
						availability="Online"
						lastOnline={null}
						createdAt={createdAt}
						level={level}
						xp={xp}
						currentLevelXpThreshold={currentLevelXpThreshold}
						currentLevelProgressPercentage={currentLevelProgressPercentage}
						displayedBadgeId={displayedBadgeId}
						availableBadges={availableBadges}
						setBadge={setDisplayedBadgeId}
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
				<AchievementsModule achievements={achievements}/>
				<PlayerStatsModule
					totalPlayed={totalPlayed}
					totalWins={totalWins}
					winStreak={winStreak}
				/>
				{ members.length > 1 && <LeavePartyModule /> }
			</div>
		</Window>
	);
}