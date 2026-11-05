import { fetchValidate } from "./fetchValidate";
import { useAuthStore } from "../../../store/AuthStore";

export const handleValidate = async () => {
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

		console.warn("[authentication > 'GET' validate] error:", error);

		return null;
	}
};