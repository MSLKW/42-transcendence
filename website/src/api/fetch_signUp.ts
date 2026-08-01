import { fetch_signIn } from "./fetch_signIn";

export const fetch_signUp = async (email: string, password: string) => {
	const response = await fetch("/api/auth/signup", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ email, password }),
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		if (response.status === 400)
			throw new Error("Invalid email / password");
		else if (response.status === 409)
			throw new Error("An account with this email already exists");
		else
			throw new Error(errorData.message || "Failed to create account");
	}

	await response.json();

	return fetch_signIn(email, password);;
}