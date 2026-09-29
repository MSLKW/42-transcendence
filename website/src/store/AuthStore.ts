import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthValues {
	authVerboseMode: boolean;
	authenticated: boolean;
	clientUuid: string | null;
	createdAt: Date | null;
	lastLogin: Date | null;
}

interface AuthState extends AuthValues {
	resetValues: () => void;
};

export const useAuthStore = create<AuthState>() (
	persist(
		(set, _get) => ({
			authVerboseMode: false,
			authenticated: false,
			clientUuid: null,
			createdAt: null,
			lastLogin: null,

			resetValues: () => {
				set({
					authenticated: false,
					clientUuid: null,
					createdAt: null,
					lastLogin: null,
				});
			},
		}),
		{
			name: 'auth-storage',
		}
	)
);