import { useState, useRef, useEffect } from "react";
import { handleCreatedAt } from "../../api/authentication/get_created-at/handleCreatedAt";
import { handlePublicPlayerGameData } from "../../api/gameStats/get_public-player-game-data/handlePublicPlayerGameData";
import { handleGetOnline } from "../../api/party/get_online/handleGetOnline";
import { handleGetProfile } from "../../api/profile/get_profile/handleGetProfile";
import { useAuthStore } from "../../store/AuthStore";
import { useGameStatsStore } from "../../store/GameStatsStore";
import { usePartyStore, type AVAILABILITY_TYPE } from "../../store/PartyStore";
import { useProfileStore } from "../../store/ProfileStore";
import { useSceneStore } from "../../store/SceneStore";
import { Window } from "../window/Window";
import { AvatarMemberModule } from "../avatar/AvatarMemberModule";
import { AchievementsModule } from "../player/achievements/AchievementsModule";
import { PlayerDataModule } from "../player/data/PlayerDataModule";
import { PlayerStatsModule } from "../player/stats/PlayerStatsModule";
import { FriendToggleButton } from "./friend/FriendToggleButton";
import { KickPlayerButton } from "./kick/KickPlayerButton";

export const StatsWindow: React.FC = () => {
	const authVerboseMode = useAuthStore((store) => store.authVerboseMode);
	const cachedStats = useGameStatsStore((store) => store.cachedStats);
	const gameStatsVerboseMode = useGameStatsStore((store) => store.gameStatsVerboseMode);
	const members = usePartyStore((store) => store.members);
	const partyVerboseMode = usePartyStore((store) => store.partyVerboseMode);
	const cachedProfiles = useProfileStore((store) => store.cachedProfiles);
	const profileVerboseMode = useProfileStore((store) => store.profileVerboseMode);
	const statsUuid = useSceneStore((store) => store.statsUuid!);
	
	const cachedProfile = statsUuid && statsUuid in cachedProfiles ? cachedProfiles[statsUuid] : undefined;
	const cachedStat = statsUuid && statsUuid in cachedStats ? cachedStats[statsUuid] : undefined;

	const [name, setName] = useState(cachedProfile?.name ?? "n/a");
	const [avatar, setAvatar] = useState(cachedProfile?.avatar ?? undefined);
	const [createdAt, setCreatedAt] = useState<Date | null>(null);
	const [availability, setAvailability] = useState<AVAILABILITY_TYPE | null>(null);
	const [lastOnline, setLastOnline] = useState<Date | null>(null);
	const [level, setLevel] = useState(cachedStat?.level ?? 0);
	const [xp, setXp] = useState(cachedStat?.xp ?? 0);
	const [currentLevelXpThreshold, setCurrentLevelXpThreshold] = useState(cachedStat?.currentLevelXpThreshold ?? 0);
	const [currentLevelProgressPercentage, setCurrentLevelProgressPercentage] = useState(cachedStat?.currentLevelProgressPercentage ?? 0);
	const [displayedBadgeId, setDisplayedBadgeId] = useState(cachedStat?.displayedBadgeId ?? "fresh_deal");
	const [totalPlayed, setTotalPlayed] = useState(cachedStat?.totalPlayed ?? 0);
	const [totalWins, setTotalWins] = useState(cachedStat?.totalWins ?? 0);
	const [winStreak, setWinStreak] = useState(cachedStat?.winStreak ?? 0);
	const [achievements, setAchievements] = useState(cachedStat?.achievements ?? undefined);

	const dataFetched = useRef<string | null>(null);
	useEffect(() => {
		if (dataFetched.current)
			return;
		dataFetched.current = statsUuid;

		const fetchPlayerData = async () => {
			try {
				const [profile, createdAt, online, playerStats] = await Promise.all([
					handleGetProfile(statsUuid),
					handleCreatedAt(statsUuid),
					handleGetOnline(statsUuid),
					handlePublicPlayerGameData(statsUuid),
				]);

				setName(profile?.username ?? "n/a");
				setAvatar(profile?.avatarPath ?? undefined);

				setCreatedAt(createdAt ?? null);

				setLevel(playerStats.stats.level);
				setXp(playerStats.stats.xp);
				setDisplayedBadgeId(playerStats.stats.displayedBadgeId);
				setTotalPlayed(playerStats.stats.totalPlayed);
				setTotalWins(playerStats.stats.totalWins);
				setWinStreak(playerStats.stats.winStreak);
				setCurrentLevelXpThreshold(playerStats.levelProgress.currentLevelXpThreshold);
				setCurrentLevelProgressPercentage(playerStats.levelProgress.currentLevelProgressPercentage);
				setAchievements(playerStats.achievements);
				if (members && members.includes(statsUuid)) {
					useGameStatsStore.getState().updatePlayerCachedStat(statsUuid, {
						level: playerStats.stats.level,
						xp: playerStats.stats.xp,
						displayedBadgeId: playerStats.stats.displayedBadgeId,
						totalPlayed: playerStats.stats.totalPlayed,
						totalWins: playerStats.stats.totalWins,
						winStreak: playerStats.stats.winStreak,
						currentLevelXpThreshold: playerStats.levelProgress.currentLevelXpThreshold,
						currentLevelProgressPercentage: playerStats.levelProgress.currentLevelProgressPercentage,
						achievements: playerStats.achievements,
					});
				}

				if (online?.isOnline)
					setAvailability(online.inParty ? "Busy" : "Online");
				else {
					setAvailability("Offline");
					setLastOnline(online?.lastOnline ? new Date(online.lastOnline) : null);
				}
			} catch (error) {
				if (authVerboseMode || gameStatsVerboseMode || partyVerboseMode || profileVerboseMode)
					console.warn("Failed to fetch player data:", error);
			}
		};
		fetchPlayerData();
	}, [statsUuid]);

	return (
		<Window
			title={`Player Profile: ${name ?? "-"}`}
			dismissKey="stats"
			lightbox={true}
		>
			<div className="
				px-3rem
				divide-y divide-n2/40
				overflow-y-scroll
			">
				<div className="flex">
					<AvatarMemberModule uuid={statsUuid} name={name ?? "-"} image={avatar} />
					<PlayerDataModule
						uuid={statsUuid}
						availability={availability}
						lastOnline={lastOnline}
						createdAt={createdAt}
						level={level}
						xp={xp}
						currentLevelXpThreshold={currentLevelXpThreshold}
						currentLevelProgressPercentage={currentLevelProgressPercentage}
						displayedBadgeId={displayedBadgeId}
					/>
				</div>
				<AchievementsModule achievements={achievements}/>
				<PlayerStatsModule
					totalPlayed={totalPlayed}
					totalWins={totalWins}
					winStreak={winStreak}
				/>
				<div className="
					flex place-content-evenly place-items-center
					py-2rem px-2rem
					gap-1rem
				">
					{ members && members.includes(statsUuid) && <KickPlayerButton playerUuid={statsUuid}/>}
					<FriendToggleButton uuid={statsUuid} name={name ?? "Player"}/>
				</div>
			</div>
		</Window>
	);
};