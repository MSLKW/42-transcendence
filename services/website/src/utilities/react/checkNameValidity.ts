export const checkNameValidity = (name: string) => {
	const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
	return usernameRegex.test(name?.trim());
}