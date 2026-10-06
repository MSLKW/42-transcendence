import type { SettingsValues } from "../../../store/SettingsStore";

const profileUrl = import.meta.env.VITE_PROFILE_API_URL;

export const fetchPutSettings = async (settings: SettingsValues) => {
	const response = await fetch(`${profileUrl}/settings`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(settings),
	});

	if (!response.ok)
		throw new Error(`Failed to update settings (${response.status} ${response.statusText})`);

	return response;
}