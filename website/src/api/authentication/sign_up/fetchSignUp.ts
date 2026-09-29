export const fetchSignUp = async (email: string, password: string) => {
	const response = await fetch("/api/auth/signup", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ email, password }),
	});

	if (!response.ok) {
		if (response.status === 400)
			throw new Error("Invalid email / password");
		else if (response.status === 409)
			throw new Error("Email already registered");
		throw new Error(`Failed to create account (${response.status} ${response.statusText})`);
	}
}