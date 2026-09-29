export const fetchPutAvatar = async (avatar: File) => {
	const formData = new FormData();
	formData.append("avatar", avatar);

	const response = await fetch("/api/profile/avatar", {
		method: "PUT",
		body: formData,
	});

	if (!response.ok) {
		if (response.status === 400)
			throw new Error("Invalid syntax or malformed request");
		else
			throw new Error(`Failed to upload avatar (${response.status} ${response.statusText})`);
	}

	return response;
}