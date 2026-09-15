export const fetchOnline = async (uuid: string) => {
	const response = await fetch(`/api/party_manager/online/${uuid}`, {
		method: "GET",
		credentials: "include",
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		console.log(errorData.message || "Cannot fetch online status with uuid");
	}

	console.log("[/api/party_manager/online] 200 OK");
	return await response.json();
};