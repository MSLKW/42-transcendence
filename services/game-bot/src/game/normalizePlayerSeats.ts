export function normalizePlayerSeats(positions: Record<string, number>, start: string): void
{
	const playerCount = Object.keys(positions).length;
	const offset = positions[start];

	for (const key in positions)
		positions[key] = (positions[key] - offset + playerCount) % playerCount;
}
