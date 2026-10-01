const profileUrl = import.meta.env.VITE_PROFILE_API_URL;

export const fetchPutProfile = async (username: string, avatarPath: string, badge: string) => {
	const response = await fetch(`${profileUrl}/profile`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			username: username,
			badge: badge,
			avatarPath: avatarPath,
		}),
	});

	if (!response.ok) {
		if (response.status === 409)
			throw new Error("Name taken. Use a different name");
		throw new Error(`Failed to update profile (${response.status} ${response.statusText})`);
	}

	return response;
}