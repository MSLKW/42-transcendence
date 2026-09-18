import { fetchCreatedAt } from "./fetchCreatedAt";

export const handleCreatedAt = async (uuid: string) => {
	try {
		const response = await fetchCreatedAt(uuid);
		const date = new Date(response.createdAt);
		console.log("[handleCreatedAt] response:", date);
		return date;
	} catch (err) {
		const errorMsg = err instanceof Error ? err.message : "Something went wrong. Please try again";
		console.log("[handleCreatedAt] errorMsg:", errorMsg);
		return null;
	}
};