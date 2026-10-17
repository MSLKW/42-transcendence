export function upperBound<T>(
	arr: readonly T[],
	value: T,
	compare: (a: T, b: T) => number,
): number
{
	let lo = 0;
	let hi = arr.length;

	while (lo < hi)
	{
		const mid = lo + ((hi - lo) >> 1);

		if (compare(arr[mid], value) <= 0)
			lo = mid + 1;
		else
			hi = mid;
	}
	return lo;
}
