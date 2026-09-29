import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthValues {
	authVerboseMode: boolean;
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
			clientUuid: null,
			createdAt: null,
			lastLogin: null,

			resetValues: () => {
				set({
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