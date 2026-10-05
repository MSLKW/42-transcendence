const profileUrl = import.meta.env.API_PROFILE_PATH;

type SearchResponse = {
	searchResults: string[];
};

export const fetchGetSearch = async (query: string, signal?: AbortSignal): Promise<SearchResponse> => {
	const encodedQuery = encodeURIComponent(query);
	const response = await fetch(`${profileUrl}/search/${encodedQuery}`, {
		method: "GET",
		credentials: "include",
		signal,
	});

	if (!response.ok) {
		if (response.status === 404)
			throw new Error("Search query not found");
		else
			throw new Error(`Failed to search (${response.status} ${response.statusText})`);
	}

	return await response.json();
}