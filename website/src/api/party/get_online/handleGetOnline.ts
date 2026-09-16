import { fetchGetOnline } from "./fetchGetOnline";

export const handleGetOnline = async (uuid: string) => {
	try {
		const response = await fetchGetOnline(uuid);
		console.log("[handleOnline] response.id:", response.id);
		return response;
	} catch (err) {
		const errorMsg = err instanceof Error ? err.message : "Something went wrong. Please try again";
		console.log("[handleOnline] errorMsg:", errorMsg);
		return null;
	}
}
