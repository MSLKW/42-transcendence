export interface Session {
	tokenHash: string;
	userId: string;
	createdAt: Date;
	expiresAt: Date;
}
