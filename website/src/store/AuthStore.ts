import { create } from "zustand";

interface AuthValues {
	createdAt: Date;
	lastLogin: Date;
}

interface AuthState extends AuthValues {};

export const useAuthStore = create<AuthState>() (
	(set, get) => ({
		createdAt: new Date(),
		lastLogin: new Date(),
	}),
);