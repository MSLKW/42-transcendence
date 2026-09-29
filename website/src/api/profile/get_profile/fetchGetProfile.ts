import type { UserData } from "../../../store/ProfileStore";

export const fetchGetProfile = async (uuid: string): Promise<UserData> => {
	const response = await fetch(`/api/profile/profile/${uuid}`, {
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