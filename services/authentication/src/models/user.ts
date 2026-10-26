export interface User {
	id: string;
	email: string;
	username: string | null;
	passwordHash: string;
	createdAt: Date;
	failedLoginAttempts: number;
	lockedUntil: Date | null;
}
