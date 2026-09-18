// // timeout, esp when game-stats couldnt return anything yet as it dosent existss yet
// export async function fetchJson<T = any>(url: string, timeoutMs = 5000): Promise<T>
// {
// 	const controller = new AbortController();
// 	const timer = setTimeout(() => controller.abort(), timeoutMs);

// 	try
// 	{
// 		const res = await fetch(url, { signal: controller.signal });

// 		if (!res.ok)
// 			throw new Error(`Request to ${url} failed with ${res.status}`);

// 		return await res.json();
// 	}
// 	catch (err: any)
// 	{
// 		if (err.name === "AbortError")
// 			throw new Error(`Request to ${url} timed out after ${timeoutMs}ms`);
// 		throw err;
// 	}
// 	finally
// 	{
// 		clearTimeout(timer);
// 	}
// }

//
interface FetchJsonOptions extends RequestInit 
{
	timeoutMs?: number;
}

export async function fetchJson<T = any>(
	url: string,
	{ timeoutMs = 5000, ...fetchOptions }: FetchJsonOptions = {}
): Promise<T>
{
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), timeoutMs);

	try
	{
		const res = await fetch(url, { ...fetchOptions, signal: controller.signal });

		if (!res.ok)
			throw new Error(`Request to ${url} failed with ${res.status}`);

		if (res.status === 204)
			return undefined as T;

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

// USAGE GUIDE: Parameters (url, object)
// object = modular; 
//     - optional to put any timeout & fetch options(method/headers/body/etc)
//     - flexible order too 
//
// [MODULAR METHOD]
// 1. no method specified — fetch defaults to GET automatically
// await fetchJson(`${AUTH_SERVICE_URL}/internal/profile/${uuid}`);
//
// 2. PATCH — just pass it in options, function doesn't care
// await fetchJson(url, { method: "PATCH", headers: {...}, body: ... });
//
// 3. DELETE, PUT, whatever — same pattern, no changes needed to fetchJson itself
// await fetchJson(url, { method: "DELETE" });
//
// [MODULAR OBJECT]
// 4. nothing in object anything extra needed — just like before
// await fetchJson(url);
//
// 5. only override default timeout (input must in milisecond)
// await fetchJson(url, { timeoutMs: 2000 });
//
// 6. only pass fetch options
// await fetchJson(url, {
// 	method: "PATCH",
// 	headers: { "Content-Type": "application/json" },
// 	body: JSON.stringify({ username: "aisyah" }),
// });
//
// 7. both together, timeout & fetch options, both in no particular required order
// await fetchJson(url, {
// 	timeoutMs: 2000,
// 	method: "PATCH",
// 	headers: { "Content-Type": "application/json" },
// 	body: JSON.stringify({ username: "aisyah" }),
// });
