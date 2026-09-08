// timeout, esp when game-stats couldnt return anything yet as it dosent existss yet
export async function fetchJson<T = any>(url: string, timeoutMs = 5000): Promise<T>
{
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), timeoutMs);

	try
	{
		const res = await fetch(url, { signal: controller.signal });

		if (!res.ok)
			throw new Error(`Request to ${url} failed with ${res.status}`);

		return await res.json();
	}
	catch (err: any)
	{
		if (err.name === "AbortError")
			throw new Error(`Request to ${url} timed out after ${timeoutMs}ms`);
		throw err;
	}
	finally
	{
		clearTimeout(timer);
	}
}
