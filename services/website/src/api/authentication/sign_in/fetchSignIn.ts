const authUrl = import.meta.env.VITE_API_AUTH_PATH;

export const fetchSignIn = async (email: string, password: string) => {
	const response = await fetch(`${authUrl}/signin`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ identifier: email, password }),
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		if (response.status === 401)
			throw new Error("Account not found / wrong password");
		else
			throw new Error(errorData.message || `Failed to sign in (${response.status} ${response.statusText})`);
	}

	return await response.json();
};