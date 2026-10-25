import { 
	AchievementUnlockedRequest,
	AchievementUnlockedResponse,
	BadgeId,
	DisplayedBadgeRequest,
	EasterEggResponse,
	GameEndStatsResponse, 
	OwnPlayerGameDataResponse, 
	PublicPlayerGameDataResponse } from "@big2/game-stats-types/game-stats";
import { GameEndStatsInput } from "../types/GameEndStatsInput";


// game-end-stats: use apply, not update or add. 
// It isn’t only an update (it also inserts the processed round and badge rows), and it isn’t only an add (it changes existing counters). 
// apply names the business operation: “apply this round’s result”
// drop Input from the method name, since that’s the type’s name, not an action.
// namings:
// 		get		read something
// 		set		overwrite one value
// 		grant	give something once (idempotent)
// 		apply	work out and save the result of an event

export interface GameStatsRepository { // only list publics, no private properties / methods

	// requested by website
	getOwnPlayerGameData(playerUuid: string): Promise<OwnPlayerGameDataResponse>;
	getPublicPlayerGameData(playerUuid: string): Promise<PublicPlayerGameDataResponse>;			// throw for an unknown uuid
	setDisplayedBadge(playerUuid: string, input: DisplayedBadgeRequest): Promise<boolean>;
	grantEasterEggBadge(playerUuid: string, badgeId: BadgeId): Promise<EasterEggResponse>;		// throw if invalid secret badge

	// requested by game-server
	grantAchievement(input: AchievementUnlockedRequest): Promise<AchievementUnlockedResponse>;	// throw for an unknown player
	applyGameEndStats(input: GameEndStatsInput): Promise<GameEndStatsResponse>;						
}