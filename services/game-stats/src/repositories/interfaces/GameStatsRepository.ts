import { 
	AchievementUnlockedRequest,
	BadgeUnlockedRequest,
	DisplayedBadgeRequest,
	GameEndStatsInput,
	GameEndStatsResponse, 
	OwnPlayerGameDataResponse, 
	PlayerStatsData, 
	PublicPlayerGameDataResponse } from "@big2/game-stats-types";


// game-end-stats: use apply, not update or add. 
// It isn’t only an update (it also inserts the processed round and badge rows), and it isn’t only an add (it changes existing counters). 
// apply names the business operation: “apply this round’s result”
// drop Input from the method name, since that’s the type’s name, not an action.
// namings:
// 		get		read something
// 		set		overwrite one value
// 		grant	give something once (idempotent)
// 		apply	work out and save the result of an event

export interface GameStatsRepository {

	// --- private ---
	// create
	createPlayerStats(playerUuid: string): Promise<PlayerStatsData>;

	// --- public ---	
	// get
	getOwnPlayerGameData(playerUuid: string): Promise<OwnPlayerGameDataResponse>;
	getPublicPlayerGameData(playerUuid: string): Promise<PublicPlayerGameDataResponse>;

	// update
	// false, reason: badge is locked
	updateDisplayedBadge(input: DisplayedBadgeRequest): Promise<boolean>;

	// grant 
	// false, reason: invalid player uuid
	// false, reason: badge is not worthy to be unlocked
	// false, reason: achievement is not from trusted source
	grantAchievement(input: AchievementUnlockedRequest): Promise<boolean>;
	grantBadge(input: BadgeUnlockedRequest): Promise<boolean>;				// this is for easter egg too later

	// apply
	applyGameEndStats(input: GameEndStatsInput): Promise<GameEndStatsResponse>;						
}