const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export function validateEmail(email: string): boolean {
	return EMAIL_REGEX.test(email);
}

export function validatePassword(password: string): { valid: boolean; reason?: string } {
	if (password.length < MIN_PASSWORD_LENGTH) {
		return { valid: false, reason: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.` };
	}
	return { valid: true };
}
