export const fetchPutProfile = async (username: string, avatarPath: string, badge: string) => {
	const response = await fetch(`/api/profile/profile`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			username: username,
			badge: badge,
			avatarPath: avatarPath,
		}),
	});

	if (!response.ok) {
		console.log("[fetchPutProfile] failed");
		return;
	}
	
	console.log("[fetchPutProfile] 200 OK");
	return response;
}