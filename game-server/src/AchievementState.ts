import { EventEmitter } from "node:stream";
import { PlayerState } from "./PlayerState.js";
import { CardHeapState } from "./CardHeapState.js";
import { GameState } from "./GameState.js";
import { CardHandTransmit, GameEndStatsTransmit, HandType, CardRank, CardSuit, PentupleType, SkipTurnTransmit, PlayerStatsTransmit, AchievementUnlockTransmit } from "@big2/game-types";

type PlayerTracker = {
	uuid: string,
	hasPassed: boolean,
	stats: PlayerStatsTransmit | undefined
	// achievements unlocked interface
}

/* 
	Handles Getting Player Achievements to check against detection, Achievement Detection and publishing events
*/
export class AchievementState {
	private static readonly GAME_STATS_SERVICE_URL = process.env.GAME_STATS_SERVICE_URL;
	private playerTrackers: Record<string, PlayerTracker>;
	private gameEvents: EventEmitter;

	constructor(gameEvents: EventEmitter) {
		this.gameEvents = gameEvents;
		this.playerTrackers = {};

		this.bindEventListeners();
	}

	private bindEventListeners() {
		this.gameEvents.on("player:is_leading", (cardHandTransmit: CardHandTransmit) => {
			if (cardHandTransmit === undefined)
				return ;
			const playerUuid = cardHandTransmit.playerId;
			switch (cardHandTransmit.handType) {
				case HandType.Single:
					this.unlockAchievement(playerUuid, "best_single");
					break ;
				case HandType.Double:
					this.unlockAchievement(playerUuid, "best_double");
					break ;
				case HandType.Triple:
					this.unlockAchievement(playerUuid, "best_triple");
					break ;
				case HandType.Pentuple:
					switch (cardHandTransmit.pentupleType) {
						case PentupleType.Straight:
							this.unlockAchievement(playerUuid, "best_straight");
							break ;
						case PentupleType.Flush:
							this.unlockAchievement(playerUuid, "best_flush");
							break ;
						case PentupleType.FullHouse:
							this.unlockAchievement(playerUuid, "best_full_house");
							break ;
						case PentupleType.FourOfAKind:
							this.unlockAchievement(playerUuid, "best_four_of_a_kind");
							break ;
						case PentupleType.StraightFlush:
							this.unlockAchievement(playerUuid, "best_straight_flush");
							break ;
					}
					break ;
			}
		});

		this.gameEvents.on("player:play_card_hand", (cardHand: CardHandTransmit) => {
			if (cardHand.handType === HandType.Single) {
				for (let i = 0; i < cardHand.cards.length; i++) {
					const card = cardHand.cards[i];
					if (card.rank === CardRank.Three && card.suit === CardSuit.Diamond) {
						this.unlockAchievement(cardHand.playerId, "play_three_diamonds");
					}
					else if (card.rank === CardRank.Two && card.suit === CardSuit.Spade) {
						this.unlockAchievement(cardHand.playerId, "play_two_spades");
					}
				}
			}
		});

		this.gameEvents.on("player:skip_turn", (skipTurnTransmit: SkipTurnTransmit) => {
			this.playerTrackers[skipTurnTransmit.playerId].hasPassed = true;
		});

		this.gameEvents.on("game:end", (gameEndStatsTransmit: GameEndStatsTransmit) => {
			const playerTracker = this.playerTrackers[gameEndStatsTransmit.winnerPlayerUuid];
			if (playerTracker.hasPassed === false) {
				this.unlockAchievement(gameEndStatsTransmit.winnerPlayerUuid, "win_no_pass");
			}
			if (playerTracker.stats !== undefined && playerTracker.stats.totalWins === 1) {
				this.unlockAchievement(gameEndStatsTransmit.winnerPlayerUuid, "first_win");
			}
		});

	}

	public setupPlayerTracker(players: Array<PlayerState>) {
		for (let i = 0; i < players.length; i++) {
			const player = players[i];
			const playerTracker: PlayerTracker = {
				uuid: player.uuid,
				hasPassed: false,
				stats: this.fetchPlayerGameStats(player.uuid),
			}
			this.playerTrackers[player.uuid] = playerTracker;
		}
	}

	private fetchPlayerGameStats(playerUuid: string): PlayerStatsTransmit | undefined {
		// const responsePromise = fetch(`${AchievementState.GAME_STATS_SERVICE_URL}/player-stats`, {
		// 	method: 'GET',
		// 	headers: {
		// 		'Accept': 'application/json'
		// 	}
		// }); // not sure what the endpoint is called
		// const response = responsePromise.();
		// if (!response.ok) {
		// 	return (undefined);
		// }

		// return (response.json()); 
		const playerStats: PlayerStatsTransmit = {
			totalPlayed: 0,
			totalWins: 0,
			winstreak: 0,
			unlockedBadges: [],
			unlockedAchievements: [],
			xp: 0,
			level: 0
		}
		return (playerStats);
	}

	private unlockAchievement(playerUuid: string, achievementId: string) {
		const playerTracker = this.playerTrackers[playerUuid];

		if (playerTracker === undefined || playerTracker.stats === undefined) {
			console.log(`[AchievementState] ${playerUuid} does not exist or have stats`);
			return ;
		}
		const alreadyUnlocked: boolean = playerTracker.stats.unlockedAchievements.find((achievement) => achievement.achievementId === achievementId) !== undefined;
		if (alreadyUnlocked) {
			return ;
		}

		const achievementUnlockTransmit: AchievementUnlockTransmit = {
			playerUuid: playerUuid,
			achievementId: achievementId,
			unlockedAt: new Date().toISOString()
		};

		// send to game stats and website
		this.gameEvents.emit("player:unlock_achievement", achievementUnlockTransmit);
		this.transmitAchievementUnlock(achievementUnlockTransmit);
	}

	private async transmitGameEndStats(gameEndStatsTransmit: GameEndStatsTransmit) {
		// const response = await fetch(`${AchievementState.GAME_STATS_SERVICE_URL}/game-end`, {
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 		'Accept': 'application/json',
		// 	},
		// 	body: JSON.stringify(gameEndStatsTransmit)
		// });
	}

	private async transmitAchievementUnlock(transmit: AchievementUnlockTransmit) {
		// const response = await fetch(`${AchievementState.GAME_STATS_SERVICE_URL}/achievement-unlock`, {
		// 	method: 'PUT',
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 		'Accept': 'application/json',
		// 	},
		// 	body: JSON.stringify(transmit)
		// });
	}
}