export interface Session {
	token: string;
	userId: string;
	createdAt: Date;
	expiresAt: Date;
}
