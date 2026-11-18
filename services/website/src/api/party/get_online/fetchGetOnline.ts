const partyUrl = import.meta.env.VITE_API_PARTY_PATH;

export const fetchGetOnline = async (uuid: string) => {
	const response = await fetch(`${partyUrl}/online/${uuid}`, {
		method: "GET",
		credentials: "include",
	});

	if (!response.ok)
		throw new Error(`Failed to get online data (${response.status}, ${response.statusText})`);

	const text = await response.text();
	if (!text || text.trim() === "")
		return [];
	return JSON.parse(text);
};