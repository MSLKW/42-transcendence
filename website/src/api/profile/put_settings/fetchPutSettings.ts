import type { SettingsValues } from "../../../store/SettingsStore";

export const fetchPutSettings = async (settings: SettingsValues) => {
	const response = await fetch(`/api/profile/settings`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(settings),
	});

	if (!response.ok) {
		console.log("[fetchPutSettings] failed");
		return;
	}
	
	console.log("[fetchPutSettings] 200 OK");
	return response;
}