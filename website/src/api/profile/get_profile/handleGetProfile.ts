import type { UserData } from "../../../store/ProfileStore";
import { fetchGetProfile } from "./fetchGetProfile";

export const handleGetProfile = async (uuid: string): Promise<UserData | null> => {
	try {
		const response = await fetchGetProfile(uuid);
		console.log("[handleGetProfile] response:", response);
		return response;
	} catch (err) {
		const errorMsg = err instanceof Error ? err.message : "Something went wrong. Please try again";
		console.log("[handleGetProfile] errorMsg:", errorMsg);
		return null;
	}
}