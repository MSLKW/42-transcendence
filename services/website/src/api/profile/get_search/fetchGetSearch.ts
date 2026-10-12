type SearchResponse = {
	searchResults: string[];
};

export const fetchGetSearch = async (query: string, signal?: AbortSignal): Promise<SearchResponse> => {
	const encodedQuery = encodeURIComponent(query);

	const response = await fetch(`/api/profile/search/${encodedQuery}`, {
		method: "GET",
		credentials: "include",
		signal,
	});

	console.log("[fetchGetSearch] ", `/api/profile/search/${query} `, response.status, response.statusText);
	if (!response.ok)
		throw new Error(`Search failed: ${response.status} ${response.statusText}`);
	return await response.json();
}