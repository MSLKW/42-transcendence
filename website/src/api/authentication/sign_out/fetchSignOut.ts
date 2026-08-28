export const signOutFetch = async () => {
	const response = await fetch("/api/auth/logout", {
		method: "DELETE",
		credentials: "include",
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.message || "Could not log out. Please try again");
	}
};