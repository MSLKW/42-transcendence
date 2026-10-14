export const BADGES = [
	{ label: "Newcomer", 		minLevel: 0 },
	{ label: "Beginner's Luck",	minLevel: 1 },
	{ label: "Challenger", 		minLevel: 5 },
	{ label: "Enthusiast", 		minLevel: 10 },
	{ label: "Risk Taker", 		minLevel: 20 },
	{ label: "The Strategist", 	minLevel: 35 },
	{ label: "Big 2 Champion", 	minLevel: 50 },
] as const satisfies readonly { label: string; minLevel: number }[];

export type BadgeLabel = (typeof BADGES)[number]["label"];

export const badgesForLevel = (level: number): BadgeLabel[] =>
	BADGES.filter((b) => level >= b.minLevel).map((b) => b.label);