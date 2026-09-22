export const fetchGetSettings = async (uuid: string) => {
	const response = await fetch(`/api/profile/settings/${uuid}`, {
		method: "GET",
		credentials: "include",
	});

	if (!response.ok)
		throw new Error(`Failed to get settings: ${response.status} ${response.statusText}`);

	console.log("[fetchGetSettings] ", `/api/profile/settings/${uuid} `, response.status, response.statusText);
	return await response.json();
}