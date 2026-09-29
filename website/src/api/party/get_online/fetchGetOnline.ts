export const fetchGetOnline = async (uuid: string) => {
	const response = await fetch(`/api/party/online/${uuid}`, {
		method: "GET",
		credentials: "include",
	});

	if (!response.ok)
		throw new Error(`Failed to get online data (${response.status}, ${response.statusText})`);

	return await response.json();
};