import { LevelProgress } from "@big2/game-stats-types";

const BASE_XP = 100;			// xp to go from level 0 to 1
const GROWTH = 1.1;				// each level costs 10% more than the last
export const MAX_LEVEL = 50;	// matches the highest level badge

// total xp needed to reach each level, built once at startup. index = level.
const LEVEL_THRESHOLDS: number[] = [0];
for (let level = 1; level <= MAX_LEVEL; level++)
	LEVEL_THRESHOLDS.push(LEVEL_THRESHOLDS[level - 1] + Math.round(BASE_XP * GROWTH ** (level - 1)));

export function levelForXp(xp: number): number
{
	let level = 0;
	while (level < MAX_LEVEL && xp >= LEVEL_THRESHOLDS[level + 1])
		level++;
	return (level);
}

export function levelProgressForXp(xp: number): LevelProgress
{
	const level = levelForXp(xp);
	const levelStartXp = LEVEL_THRESHOLDS[level];		// total XP at which this level began
	const levelXpEarned = xp - levelStartXp;

	if (level >= MAX_LEVEL)
		return ({ levelXpEarned, levelXpRequired: null });
	return ({ levelXpEarned, levelXpRequired: LEVEL_THRESHOLDS[level + 1] - levelStartXp });
}

export const percent = levelXpRequired === null ? 100 : Math.floor((levelXpEarned / levelXpRequired) * 100);
// label: `${levelXpEarned} / ${levelXpRequired} XP`, or "MAX" when levelXpRequired is null