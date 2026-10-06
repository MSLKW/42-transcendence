import type { UserData } from "../../../store/ProfileStore";

const profileUrl = import.meta.env.VITE_PROFILE_API_URL;

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

	return await response.json();
}