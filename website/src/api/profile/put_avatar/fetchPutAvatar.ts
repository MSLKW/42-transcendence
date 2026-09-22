export const fetchPutAvatar = async (avatar: File) => {
	const formData = new FormData();
	formData.append("avatar", avatar);

	const response = await fetch("/api/profile/avatar", {
		method: "PUT",
		body: formData,
	});

	if (!response.ok) {
		let errorMessage = "Failed to upload avatar";

		try {
			const data = await response.json()
			if (typeof data.error === "string")
				errorMessage = data.error;
		} catch {}

		throw new Error(errorMessage);
		return;
	}
	
	console.log("[fetchPutAvatar] 204 No Content");
	return response;
}