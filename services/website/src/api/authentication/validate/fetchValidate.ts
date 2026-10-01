const authUrl = import.meta.env.VITE_AUTH_API_URL;

export const fetchValidate = async () => {
	const response = await fetch(`${authUrl}/validate`, {
		method: "GET",
		credentials: "include",
	});

	if (!response.ok) {
		if (response.status === 401)
			throw new Error("Missing or malformed authorization / invalid session");
		throw new Error(`Failed to validate (${response.status} ${response.statusText})`);
	}

	return await response.json();
}