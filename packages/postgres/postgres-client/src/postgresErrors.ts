export function isForeignKeyViolation(error: unknown): boolean
{
	if (typeof error !== "object" || error === null)
		return (false);

	const pgError = error as any;

	if (pgError.code === "23503")
		return (true);
	if (pgError.cause && pgError.cause.code === "23503")
		return (true);
	return (false);
}
