import type { UserData } from "../../../store/ProfileStore";

const profileUrl = import.meta.env.VITE_API_PROFILE_PATH;

export const fetchGetProfile = async (uuid: string): Promise<UserData> => {
	const response = await fetch(`${profileUrl}/profile/${uuid}`, {
		method: "GET",
		credentials: "include",
	});

	if (!response.ok) {
		if (response.status === 404)
			throw new Error("Profile not found");
		else
			throw new Error(`Failed to get profile (${response.status} ${response.statusText})`);
	}

	const text = await response.text();
	if (!text || text.trim() === "") {
		return {
			username: null,
			avatarPath: null,
			badge: "fresh_deal",
		};
	}
	return JSON.parse(text);
}