import { fetchOnline } from "./fetchOnline";

export const handleOnline = async (uuid: string) => {
	try {
		const response = await fetchOnline(uuid);
		console.log("[handleOnline] response.id:", response.id);
		return response;
	} catch (err) {
		const errorMsg = err instanceof Error ? err.message : "Something went wrong. Please try again";
		console.log("[handleOnline] errorMsg:", errorMsg);
		return null;
	}
}
