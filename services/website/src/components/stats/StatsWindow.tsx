import { useState, useRef, useEffect } from "react";
import { handleCreatedAt } from "../../api/authentication/get_created-at/handleCreatedAt";
import { handleGetOnline } from "../../api/party/get_online/handleGetOnline";
import { handleGetProfile } from "../../api/profile/get_profile/handleGetProfile";
import { usePartyStore, type AVAILABILITY_TYPE } from "../../store/PartyStore";
import { useGameStatsStore } from "../../store/GameStatsStore";
import { useProfileStore } from "../../store/ProfileStore";
import { useSceneStore } from "../../store/SceneStore";
import { Window } from "../window/Window";
import { AvatarMemberModule } from "../avatar/AvatarMemberModule";
import { AchievementsModule } from "../player/achievements/AchievementsModule";
import { PlayerDataModule } from "../player/data/PlayerDataModule";
import { PlayerStatsModule } from "../player/stats/PlayerStatsModule";
import { FriendToggleButton } from "./friend/FriendToggleButton";
import { KickPlayerButton } from "./kick/KickPlayerButton";
import { handlePublicPlayerGameData } from "../../api/gameStats/get_public-player-game-data/handlePublicPlayerGameData";

export const StatsWindow: React.FC = () => {
	const statsUuid = useSceneStore((store) => store.statsUuid!);
	const members = usePartyStore((store) => store.members);
	const cachedProfiles = useProfileStore((store) => store.cachedProfiles);
	const cachedStats = useGameStatsStore((store) => store.cachedStats);
	
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

	const statsFetched = useRef<string | null>(null);
	useEffect(() => {
		if (statsFetched.current)
			return;
		statsFetched.current = statsUuid;

		const fetchPlayerData = async () => {
			try {
				const [profile, createdAt, online, clientStats] = await Promise.all([
					handleGetProfile(statsUuid),
					handleCreatedAt(statsUuid),
					handleGetOnline(statsUuid),
					handlePublicPlayerGameData(statsUuid),
				]);

				setName(profile?.username ?? "n/a");
				setAvatar(profile?.avatarPath ?? undefined);

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

				if (online?.isOnline)
					setAvailability(online.inParty ? "Busy" : "Online");
				else {
					setAvailability("Offline");
					setLastOnline(online?.lastOnline ? new Date(online.lastOnline) : null);
				}
			} catch (error) {
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
					<AvatarMemberModule uuid={statsFetched.current} name={name ?? "-"} image={avatar} />
					<PlayerDataModule
						uuid={statsFetched.current!}
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
					{ members && statsFetched.current && members.includes(statsFetched.current) && <KickPlayerButton playerUuid={statsFetched.current}/>}
					{statsFetched.current &&
						<FriendToggleButton uuid={statsFetched.current!} name={name ?? "Player"}/>
					}
				</div>
			</div>
		</Window>
	);
};