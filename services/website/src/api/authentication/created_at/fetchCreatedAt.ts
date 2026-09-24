export const fetchCreatedAt = async (uuid: string) => {
	const response = await fetch(`/api/auth/created-at/${uuid}`, {
		method: "GET",
		credentials: "include",
	});

	if (!response.ok) {
		console.log(`[/api/auth/created-at/${uuid}] error: Invalid or expired session`);
		return;
	}

	console.log(`[/api/auth/created-at/${uuid}] 200 OK`);
	return await response.json();
}