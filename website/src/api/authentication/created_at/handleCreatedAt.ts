import { fetchCreatedAt } from "./fetchCreatedAt";

export const handleCreatedAt = async (uuid: string) => {
	try {
		const response = await fetchCreatedAt(uuid);
		console.log("[handleCreatedAt] response:", response);
		return response;
	} catch (err) {
		const errorMsg = err instanceof Error ? err.message : "Something went wrong. Please try again";
		console.log("[handleCreatedAt] errorMsg:", errorMsg);
		return null;
	}
};