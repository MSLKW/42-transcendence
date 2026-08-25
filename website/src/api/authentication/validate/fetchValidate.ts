import { useProfileStore } from "../../../store/ProfileStore";

export const fetchValidate = async () => {
	const response = await fetch("/api/auth/validate", {
		method: "GET",
		credentials: "include",
	});
	useProfileStore.getState().setValidateResponse(response);

	if (!response.ok) {
		useProfileStore.getState().setIsAuthenticated(false);
		console.log("[/api/auth/validate] error: Invalid or expired session");
		return;
	}
	
	useProfileStore.getState().setIsAuthenticated(true);
	console.log("[/api/auth/validate] 200 OK");
}