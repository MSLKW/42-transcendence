const authUrl = import.meta.env.VITE_AUTH_API_URL;
// const authUrl = import.meta.env.API_AUTH_PATH;

export const fetchCreatedAt = async (uuid: string) => {
	const response = await fetch(`${authUrl}/created-at/${uuid}`, {
		method: "GET",
		credentials: "include",
	});

	if (!response.ok) {
		if (response.status === 404)
			throw new Error("Data not found");
		else
			throw new Error(`Failed to get data (${response.status} ${response.statusText})`);
	}

	return await response.json();
}