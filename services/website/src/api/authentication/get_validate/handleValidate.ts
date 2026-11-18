import { fetchValidate } from "./fetchValidate";
import { useAuthStore } from "../../../store/AuthStore";

export const handleValidate = async () => {
	if (!useAuthStore.getState().authAPIConnection)
		return;

	try {
		const response = await fetchValidate();
		if (!response)
			return;

		if (useAuthStore.getState().authVerboseMode)
			console.log("[authentication > 'GET' validate] response:", response);

		useAuthStore.setState({
			isAuthenticated: true,
			clientUuid: response.userId,
		});

		return response;
	} catch(error) {
		useAuthStore.setState({
			isAuthenticated: false,
			clientUuid: null,
		});

		if (useAuthStore.getState().authVerboseMode)
			console.warn("[authentication > 'GET' validate] error:", error);

		return null;
	}
};