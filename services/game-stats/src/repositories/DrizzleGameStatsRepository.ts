import { ACHIEVEMENT_IDS, AchievementUnlockedRequest, AchievementUnlockedResponse, AchievementUnlockStatus, BADGE_IDS, BadgeId, BadgeUnlockStatus, DisplayedBadgeRequest, EasterEggResponse, GameEndStatsResponse, OwnPlayerGameDataResponse, PlayerGameEndStatsResult, PlayerStatsData, PlayerStatsDataSchema, PublicPlayerGameDataResponse } from "@big2/game-stats-types/game-stats";
import { postgresClient } from "../config/postgresClient";
import { GameStatsRepository } from "./GameStatsRepository";
import { playerAchievements, playerBadges, playerStats, processedRounds } from "@big2/game-stats-schema";
import { GameEndStatsInput } from "../types/GameEndStatsInput";
import { and, eq, inArray } from "drizzle-orm";
import { getEarnedStatsBadges } from "../rules/statsBadge.rules";
import { levelForXp, levelProgressForXp } from "../rules/levels.rules";
import { isSecretBadgeId } from "../rules/easterEgg/isSecretBadgeId";
import { getBadgeForAchievement } from "../rules/achievementBadge.rules";


export class DrizzleGameStatsRepository implements GameStatsRepository {

	// ----- private methods & properties -----

	private readonly pgClient = postgresClient;

	// first visit only: MUST create the stats row AND the default badge row together
	private async ensurePlayerExists(playerUuid: string): Promise<void> 
	{
		await this.pgClient.transaction(async (tx) => 
		{
			const [existing] = await tx
				.insert(playerStats)
				.values({ playerUuid })
				.onConflictDoNothing()
				.returning({ displayedBadgeId: playerStats.displayedBadgeId });
			if (!existing)
				return; // the row exists, so its default badge row below already existed too. 

			await tx
				.insert(playerBadges)
				.values({ playerUuid, badgeId: existing.displayedBadgeId })
				.onConflictDoNothing();
		});
	}

	private async getPlayerStats(playerUuid: string): Promise<PlayerStatsData> 
	{
		const [player] = await this.pgClient
			.select()
			.from(playerStats)
			.where(eq(playerStats.playerUuid, playerUuid))
			.limit(1);
		if (!player)
			throw new Error(`player_stats row missing for ${playerUuid}`); // shouldnt happen coz already initialized with ensurePlayerExists()
		
		const cleanPlayer = PlayerStatsDataSchema.parse(player);
		return (cleanPlayer);
	}

	private async getAllAchievements(playerUuid: string): Promise<AchievementUnlockStatus> 
	{
		const rows = await this.pgClient
			.select({ 
				achievementId: 	playerAchievements.achievementId,
				unlockedAt:		playerAchievements.unlockedAt,
			})
			.from(playerAchievements)
			.where(eq(playerAchievements.playerUuid, playerUuid));
		
		// Map = key -> value lookup.
		// achievementId -> unlock time
		const unlockedAtMap = new Map(rows.map((r) => [r.achievementId, r.unlockedAt]));

		const achievementStatus = {} as AchievementUnlockStatus;
		for (const id of ACHIEVEMENT_IDS)
			achievementStatus[id] = unlockedAtMap.get(id)?.toISOString() ?? null;
		return (achievementStatus);
	}

	private async getAllBadges(playerUuid: string): Promise<BadgeUnlockStatus>
	{
		const rows = await this.pgClient
			.select({ badgeId: playerBadges.badgeId })
			.from(playerBadges)
			.where(eq(playerBadges.playerUuid, playerUuid));

		// quick check of player's badges existance 
		const unlockedBadgeIdSet = new Set(rows.map((r) => r.badgeId));

		const badgeStatus: BadgeUnlockStatus = {};
		for (const id of BADGE_IDS)
		{
			const isUnlocked: boolean = unlockedBadgeIdSet.has(id);
			if (!isUnlocked && isSecretBadgeId(id))
				continue;
			badgeStatus[id] = isUnlocked;
		}
		return (badgeStatus);
	}

	private async isBadgeUnlocked(playerUuid: string, badgeId: BadgeId): Promise<boolean>
	{
		const row = await this.pgClient
			.select()
			.from(playerBadges)
			.where(
				and(
					eq(playerBadges.playerUuid, playerUuid),
					eq(playerBadges.badgeId, badgeId)
				)
			);
		
		return (row.length > 0);
	}

	
	// ----- public methods & properties -----
	// ===== requested by website =====

	async getOwnPlayerGameData(playerUuid: string): Promise<OwnPlayerGameDataResponse> 
	{
		await this.ensurePlayerExists(playerUuid); // need to establish the player existance fist, since promise.all run parellelly

		const [ stats, achievements, badges] = await Promise.all([
			this.getPlayerStats(playerUuid),
			this.getAllAchievements(playerUuid),
			this.getAllBadges(playerUuid),
		]);

		const levelProgress = levelProgressForXp(stats.xp);
		
		return ({ stats, levelProgress, achievements, badges });
	}

	async getPublicPlayerGameData(playerUuid: string): Promise<PublicPlayerGameDataResponse> 
	{
		await this.ensurePlayerExists(playerUuid); // need to establish the player existance fist, since promise.all run parellelly

		const [ stats, achievements] = await Promise.all([
			this.getPlayerStats(playerUuid),
			this.getAllAchievements(playerUuid),
		]);

		const levelProgress = levelProgressForXp(stats.xp);

		return ({ stats, levelProgress, achievements });
	}

	async setDisplayedBadge(playerUuid: string, input: DisplayedBadgeRequest): Promise<boolean> 
	{
		await this.ensurePlayerExists(playerUuid);
		const chosenBadgeId = input.badgeId;

		const isUnlocked = await this.isBadgeUnlocked(playerUuid, chosenBadgeId);
		if (!isUnlocked)
			return false;

		await this.pgClient
			.update(playerStats)
			.set({ displayedBadgeId: chosenBadgeId })
			.where(eq(playerStats.playerUuid, playerUuid));
		return true;
	}

	async grantEasterEggBadge(playerUuid: string, badgeId: BadgeId): Promise<EasterEggResponse> 
	{
		await this.ensurePlayerExists(playerUuid);

		const grantedEasterEgg = await this.pgClient
			.insert(playerBadges)
			.values({ playerUuid, badgeId })
			.onConflictDoNothing()
			.returning({ badgeId: playerBadges.badgeId });

		const isNewlyGranted: boolean = (grantedEasterEgg.length > 0); 
		return ({ newlyGrantedBadgeIdForEasterEgg: isNewlyGranted ? badgeId : null });
	}

	// ===== requested by gmae-server =====

	async grantAchievement(input: AchievementUnlockedRequest): Promise<AchievementUnlockedResponse> 
	{
		const { playerUuid, achievementId } = input;
		await this.ensurePlayerExists(playerUuid);

		return await this.pgClient.transaction(async (tx) => 
		{
			const grantedAchievement = await tx
				.insert(playerAchievements)
				.values({ 
					playerUuid,
					achievementId,
				})
				.onConflictDoNothing()
				.returning({ id: playerAchievements.achievementId });
			const isNewlyGrantedAchievement = (grantedAchievement.length > 0);
			
			let newlyGrantedBadgeIdForAchievement: BadgeId | null = null;
			const badgeId = getBadgeForAchievement(achievementId);
			if (badgeId)
			{
				const grantedBadge = await tx
					.insert(playerBadges)
					.values({ playerUuid, badgeId })
					.onConflictDoNothing()
					.returning({ id: playerBadges.badgeId});
				if (grantedBadge.length > 0)
					newlyGrantedBadgeIdForAchievement = badgeId;
			}

			const result: AchievementUnlockedResponse = {
				playerUuid,
				achievementId,
				isNewlyGrantedAchievement,
				newlyGrantedBadgeIdForAchievement,
			};
			return result;
		});
	}

	async applyGameEndStats(input: GameEndStatsInput): Promise<GameEndStatsResponse> 
	{
		// 1. sort players in alphabetical order by uuid
		// A fixed order matters where:
		// if two rounds share players, both lock the rows in the same order, 
		// so they can't wait on each other forever.
		// Object.entries turns { "uuid-1": 50, "uuid-2": 20 } into [["uuid-1", 50], ["uuid-2", 20]]
		const players = Object.entries(input.humanXpGains)
			.sort(([uuidA], [uuidB]) => uuidA.localeCompare(uuidB));

		// 2. ensuring each player exists since we recieved them from game-server, not from auth service
		// foreign_key_violation will be thrown if it dosent exists
		for (const [playerUuid] of players)
			await this.ensurePlayerExists(playerUuid);

		const roundId = input.roundId;
		 
		return await this.pgClient.transaction(async(tx) => 
		{
			// 3. check, have this round processed already?
			const inserted = await tx
				.insert(processedRounds)
				.values({ roundId })
				.onConflictDoNothing()
				.returning({ id: processedRounds.roundId });

			// 5. yes, round has been processed & is now retrying
			if (inserted.length === 0)
			{
				console.log("replaying round for /game-end-stats", input.roundId);			
				const [savedRound] = await tx
					.select({ responseBody: processedRounds.responseBody })
					.from(processedRounds)
					.where(eq(processedRounds.roundId, roundId))
					.limit(1);
				if (!savedRound || !savedRound.responseBody)
					throw new Error(`round ${input.roundId} has no saved response`);
				return (savedRound.responseBody);
			}

			// 6. implement atomic (transaction + lock)
			// - transaction makes the changes all-or-nothing upon the same row,
			// - lock makes concurrent rounds for the same player take turns.
			// lock every player's row, then read the current stats.
				// .for("update") => makes other requests wait until this transaction ends,
				// so two rounds can't both read the same old xp and overwrite each other.

			// 6.1 extracting only the playerUuid only from list players of pairs of [uuid, xp]
			// only the uuid needed by locking query
			const playerUuidArray: string[] = [];
			for (const pair of players)
				playerUuidArray.push(pair[0]);

			// 6.2 “if there are no players, use an empty list, otherwise run the query”.
			const lockedRows = playerUuidArray.length === 0
				? []
				: await tx
					.select()
					.from(playerStats)
					.where(inArray(playerStats.playerUuid, playerUuidArray))
					.orderBy(playerStats.playerUuid)
					.for("update");			
			
			const lockedRowByUuidMap = new Map(lockedRows.map((row) => [row.playerUuid, row]));


			// STEP 7 and 8: for each player, work out the new stats, save them, and check for new badges.
			const playerAccumulatedStats: Record<string, PlayerGameEndStatsResult> = {};

			for (const [playerUuid, xpGained] of players)
			{
				const lockedRowByUuid = lockedRowByUuidMap.get(playerUuid);
				if (!lockedRowByUuid)
					throw new Error(`player_stats row missing for ${playerUuid}`);

				const isWinner = (playerUuid === input.winnerHumanUuid);
				const newXp = lockedRowByUuid.xp + xpGained;
				const newLevel = levelForXp(newXp);

				// one UPDATE with all the changes together, so the CHECK constraints
				// (wins <= played, streak <= wins) never see a half-finished state
				const [playerStatsData] = await tx
					.update(playerStats)
					.set({
						xp:				newXp,
						level:			newLevel,
						totalPlayed:	lockedRowByUuid.totalPlayed + 1,
						totalWins:		lockedRowByUuid.totalWins + (isWinner ? 1 : 0),
						winStreak:		isWinner ? lockedRowByUuid.winStreak + 1 : 0,
					})
					.where(eq(playerStats.playerUuid, playerUuid))
					.returning();
				if (!playerStatsData)
					throw new Error(`could not update stats for ${playerUuid}`);
				const cleanPlayerStatsData = PlayerStatsDataSchema.parse(playerStatsData);		// drops updatedAt

				// every badge the player qualifies for with these stats...
				const earnedBadgeIds = getEarnedStatsBadges(cleanPlayerStatsData);
				// ...insert them, and ask for back only the rows that were really new
				let newlyGrantedBadgeIdsForStats: BadgeId[] = [];
				if (earnedBadgeIds.length > 0)
				{
					const insertedBadges = await tx
						.insert(playerBadges)
						.values(earnedBadgeIds.map((badgeId) => ({ playerUuid, badgeId })))
						.onConflictDoNothing()
						.returning({ badgeId: playerBadges.badgeId });
					newlyGrantedBadgeIdsForStats = insertedBadges.map((badge) => badge.badgeId);
				}

				playerAccumulatedStats[playerUuid] = {
					stats:							cleanPlayerStatsData,
					previousLevel:					lockedRowByUuid.level,
					isLeveledUp:					newLevel > lockedRowByUuid.level,
					levelProgress:					levelProgressForXp(newXp),
					newlyGrantedBadgeIdsForStats,
				};
			}

			// 9: build the response and save a copy, so a retry gets the same answer.
			const response: GameEndStatsResponse = { roundId, playerAccumulatedStats };
			await tx
				.update(processedRounds)
				.set({ responseBody: response })
				.where(eq(processedRounds.roundId, input.roundId));
			return (response);		
		});
	}
}