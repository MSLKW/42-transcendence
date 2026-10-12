import { create } from "zustand";

interface AuthValues {
	clientUuid: string | null;
	createdAt: Date;
	lastLogin: Date;
}

interface AuthState extends AuthValues {};

export const useAuthStore = create<AuthState>() (
	(_set, _get) => ({
		clientUuid: null,
		createdAt: new Date(),
		lastLogin: new Date(),
	}),
);