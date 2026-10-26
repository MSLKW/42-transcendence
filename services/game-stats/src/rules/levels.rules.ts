import { type LevelProgress } from "@big2/game-stats-types/game-stats";



// 1. set fixed rules's values
const BASE_XP_LEVEL_0 = 100;	// xp to go from level 0 to 1
const GROWTH = 1.1;				// each level costs 10% more than the last
const MAX_LEVEL = 100;			// matches the highest level badge 
									// (at GROWTH 1.1, level 100 needs about 13.8M xp; the integer column in db schema would overflow around level 150)


// 2. main method to set up all property values in LevelProgress types
export function levelProgressForXp(xp: number): LevelProgress
{
	const currentLevel = levelForXp(xp);						// never above MAX_LEVEL
	const levelStartXp = LEVEL_THRESHOLDS[currentLevel];
	const currentLevelXpEarned = xp - levelStartXp;				// keeps growing for players beyond max level, which is fine

	if (currentLevel >= MAX_LEVEL)
		return ({
			currentLevel,
			currentLevelXpEarned,
			currentLevelXpThreshold: null,
			currentLevelProgressPercentage: 100,
		});

	const currentLevelXpThreshold = LEVEL_THRESHOLDS[currentLevel + 1] - levelStartXp;
	return ({
		currentLevel,
		currentLevelXpEarned,
		currentLevelXpThreshold,
		currentLevelProgressPercentage: Math.floor((currentLevelXpEarned / currentLevelXpThreshold) * 100),
	});
}


// 3. helper methods to do specific calculations for main method
// total xp needed to reach each level, built once at startup. index = level.
const LEVEL_THRESHOLDS: number[] = [0];
for (let level = 1; level <= MAX_LEVEL; level++)
	LEVEL_THRESHOLDS.push(LEVEL_THRESHOLDS[level - 1] + Math.round(BASE_XP_LEVEL_0 * GROWTH ** (level - 1)));

// have this guard right after the table is built
// so a future edit can’t let database column's interger overflow silently, for self reminder too							
const INT32_MAX = 2_147_483_647;
if (LEVEL_THRESHOLDS[MAX_LEVEL] > INT32_MAX / 2)
	throw new Error("level table needs more than half of the integer xp column: lower GROWTH or MAX_LEVEL");

// determine current level based on current accumulated xp in database
export function levelForXp(xp: number): number
{
	let level = 0;
	while (level < MAX_LEVEL && xp >= LEVEL_THRESHOLDS[level + 1])
		level++;
	return (level);
}

