import type { UserData } from "../../../store/ProfileStore";

export const fetchGetProfile = async (uuid: string): Promise<UserData> => {
	const response = await fetch(`/api/profile/profile/${uuid}`, {
		method: "GET",
		credentials: "include",
	});

	if (!response.ok)
		throw new Error(`Failed to get profile: ${response.status} ${response.statusText}`);

	console.log("[fetchGetProfile] ", `/api/profile/profile/${uuid} `, response.status, response.statusText);
	return await response.json();
}