export function normalizePlayerSeats(positions: Record<string, number>, start: string): void
{
	const offset = positions[start];

	for (const key in positions)
	{
		positions[key] = (positions[key] - offset + 4) % 4;
	}
}
