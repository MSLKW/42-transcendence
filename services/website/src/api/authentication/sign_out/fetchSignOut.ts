const authUrl = import.meta.env.API_AUTH_PATH;

export const fetchSignOut = async () => {
	const response = await fetch(`${authUrl}/logout`, {
		method: "DELETE",
		credentials: "include",
	});

	if (!response.ok) {
		if (response.status === 401)
			throw new Error("Missing or malformed authorization / invalid session");
		throw new Error(`Failed to log out (${response.status} ${response.statusText})`);
	}
};