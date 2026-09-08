export const fetchGetProfile = async (uuid: string) => {
	const response = await fetch(`/api/profile/profile/${uuid}`, {
		method: "GET",
		credentials: "include",
	});

	console.log("[fetchGetProfile] ", `/api/profile/profile/${uuid} `, response.status, response.statusText);
	if (!response.ok)
		return;
	return await response.json();
}