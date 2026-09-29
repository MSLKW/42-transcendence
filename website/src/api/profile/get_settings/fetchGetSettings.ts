export const fetchGetSettings = async (uuid: string) => {
	const response = await fetch(`/api/profile/settings/${uuid}`, {
		method: "GET",
		credentials: "include",
	});

	if (!response.ok) {
		if (response.status === 404)
			throw new Error("Settings not found");
		else
			throw new Error(`Failed to get settings (${response.status} ${response.statusText})`);
	}

	return await response.json();
}