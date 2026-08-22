import { useProfileStore } from "../../../store/ProfileStore";

export const fetchValidate = async () => {
	const response = await fetch("/api/auth/validate", {
		method: "GET",
		credentials: "include",
	});
	useProfileStore.setState({ validateResponse: response });

	if (!response.ok) {
		useProfileStore.setState({ isAuthenticated: false });
		console.log("[/api/auth/validate] error: Invalid or expired session");
		return;
	}
	
	useProfileStore.setState({ isAuthenticated: true });
	console.log("[/api/auth/validate] 200 OK");
}