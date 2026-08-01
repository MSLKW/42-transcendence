export const fetch_signIn = async (email: string, password: string) => {
	const response = await fetch("/api/auth/signin", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ identifier: email, password }),
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		if (response.status === 401)
			throw new Error("Account not found / wrong password");
		else
			throw new Error(errorData.message || "Invalid email or password");
	}

	return await response.json();
};